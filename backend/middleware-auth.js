// middleware/auth.js - JWT Authentication Middleware
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  if (token.startsWith('demo-token-')) {
    req.user = { email: 'demo@zandjsvestiario.com', role: 'admin', demo: true };
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

export const optionalAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    if (token.startsWith('demo-token-')) {
      req.user = { email: 'demo@zandjsvestiario.com', role: 'admin', demo: true };
    } else {
      try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
      } catch (error) {
        // Token invalid, continue as guest
      }
    }
  }
  next();
};
