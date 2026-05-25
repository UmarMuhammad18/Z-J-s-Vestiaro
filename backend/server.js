// server.js - Express Server Entry Point
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { errorHandler } from './middleware-errorHandler.js';
import supabase from './config-database.js';

// Import routes
import authRoutes from './routes-auth.js';
import productRoutes from './routes-products.js';
import cartRoutes from './routes-cart.js';
import orderRoutes from './routes-orders.js';
import paymentRoutes from './routes-payments.js';
import inventoryRoutes from './routes-inventory.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost,http://127.0.0.1,https://z-n-j-s-vestiaro.vercel.app')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, file://)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.some(orig => origin === orig || origin.startsWith(orig))) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Ensure default admin user exists for deployments that are using the demo login flow.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
const adminFirstName = process.env.ADMIN_FIRST_NAME || 'Admin';
const adminLastName = process.env.ADMIN_LAST_NAME || 'User';

const serviceSupabase = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey, { realtime: { transport: ws } })
  : null;

if (!serviceSupabase) {
  console.warn('SUPABASE_SERVICE_ROLE_KEY is not set. Admin creation may fail if your Supabase table uses Row Level Security.');
}

const getDbClient = () => serviceSupabase || supabase;

async function ensureAdminUser() {
  try {
    const client = getDbClient();
    if (!client) {
      console.warn('No Supabase client available to seed admin user.');
      return;
    }

    const { data, error } = await client
      .from('users')
      .select('id')
      .eq('email', adminEmail);

    if (error) {
      console.warn('Error checking for existing admin user:', error.message || error);
      return;
    }

    if (data?.length > 0) {
      console.log(`Admin user already exists: ${adminEmail}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const { data: newUser, error: createError } = await client
      .from('users')
      .insert({
        email: adminEmail,
        password_hash: hashedPassword,
        first_name: adminFirstName,
        last_name: adminLastName,
        created_at: new Date()
      })
      .select()
      .single();

    if (createError) {
      console.error('Failed to create default admin user:', createError);
      return;
    }

    console.log(`Default admin seeded: ${adminEmail}`);
  } catch (error) {
    console.error('Error ensuring default admin user:', error);
  }
}

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/inventory', inventoryRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Z&J\'s Vestiaro Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      payments: '/api/payments',
      inventory: '/api/inventory'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
ensureAdminUser().finally(() => {
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════╗
║  Z&J's Vestiaro Backend               ║
║  Server running on port ${PORT}           ║
║  Environment: ${process.env.NODE_ENV || 'development'}        ║
╚════════════════════════════════════════╝
  `);
  });
});

export default app;
