// controllers/authController.js - Authentication Controller
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import supabase from './config-database.js';
import { validateEmail, validatePassword } from './utils-validators.js';

const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '30d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password must be at least 8 characters with uppercase, lowercase, and number' 
      });
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already registered' });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        created_at: new Date()
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to create user' });
    }

    const { accessToken, refreshToken } = generateTokens(newUser.id, newUser.email);

    res.status(201).json({
      success: true,
      data: {
        user: { id: newUser.id, email: newUser.email, firstName, lastName },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const defaultAdminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const defaultAdminPassword = process.env.ADMIN_PASSWORD || 'password123';

    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, error: 'Invalid email' });
    }

    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      console.warn(`Failed login attempt for ${email}: user not found or query error`, error || 'no user');

      if (email === defaultAdminEmail && password === defaultAdminPassword) {
        const hashedAdminPassword = await bcrypt.hash(defaultAdminPassword, 10);
        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert({
            email: defaultAdminEmail,
            password_hash: hashedAdminPassword,
            first_name: 'Admin',
            last_name: 'User',
            created_at: new Date()
          })
          .select()
          .single();

        if (createError || !createdUser) {
          console.error('Failed to auto-create default admin user:', createError || 'no user created');
          return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        user = createdUser;
        console.log(`Default admin user created during login: ${defaultAdminEmail}`);
      } else {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      console.warn(`Failed login attempt for ${email}: password mismatch`);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id, user.email);

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Current and new passwords are required' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        error: 'New password must be at least 8 characters with uppercase, lowercase, and number'
      });
    }

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId);

    if (updateError) {
      return res.status(500).json({ success: false, error: 'Failed to update password' });
    }

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const { data: user } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', decoded.userId)
      .single();

    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user.id, user.email);

    res.json({
      success: true,
      data: { accessToken, refreshToken: newRefreshToken }
    });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid refresh token' });
  }
};

export const logout = (req, res) => {
  // Since we're using stateless JWT, logout is just client-side token deletion
  res.json({ success: true, message: 'Logged out successfully' });
};
