// SETUP-CHECKLIST.md - Complete Setup Verification

## ✅ Pre-Setup Requirements

- [ ] Node.js 16+ installed
- [ ] npm installed
- [ ] Supabase account created
- [ ] Stripe account created
- [ ] Git configured (optional)
- [ ] Code editor ready (VS Code, etc.)

## ✅ Installation Steps

- [ ] Download/clone project
- [ ] Navigate to project directory
- [ ] Run `npm install` successfully
- [ ] All dependencies installed without errors

## ✅ Configuration

- [ ] Copied `.env.example` to `.env`
- [ ] Obtained Supabase URL
- [ ] Obtained Supabase Anon Key
- [ ] Obtained Supabase Service Role Key
- [ ] Updated `SUPABASE_URL` in `.env`
- [ ] Updated `SUPABASE_ANON_KEY` in `.env`
- [ ] Updated `SUPABASE_SERVICE_ROLE_KEY` in `.env`
- [ ] Set `JWT_SECRET` to strong random string
- [ ] Set `REFRESH_TOKEN_SECRET` to strong random string
- [ ] Obtained Stripe Secret Key
- [ ] Obtained Stripe Publishable Key
- [ ] Obtained Stripe Webhook Secret
- [ ] Updated `STRIPE_SECRET_KEY` in `.env`
- [ ] Updated `STRIPE_PUBLISHABLE_KEY` in `.env`
- [ ] Updated `STRIPE_WEBHOOK_SECRET` in `.env`
- [ ] Set `CORS_ORIGIN` (default: http://localhost:3000)
- [ ] Saved `.env` file

## ✅ Database Setup

- [ ] Logged into Supabase dashboard
- [ ] Selected correct project
- [ ] Opened SQL Editor
- [ ] Created new query
- [ ] Copied all SQL from `database-schema.sql`
- [ ] Executed SQL successfully
- [ ] All 11 tables created
- [ ] Indexes created
- [ ] Functions created
- [ ] Row Level Security prepared

## ✅ Server Testing

- [ ] Run `npm run dev` or `npm start`
- [ ] Server started without errors
- [ ] Console shows: "Server running on port 5000"
- [ ] Server responds to health check:
  ```bash
  curl http://localhost:5000/health
  ```
- [ ] Response contains `"success": true`

## ✅ API Testing

### Basic Tests
- [ ] GET `/` - Returns API info
- [ ] GET `/health` - Returns server status
- [ ] GET `/api/products` - Returns empty or sample products
- [ ] GET `/api/products/categories` - Returns empty or sample categories

### Authentication Tests
- [ ] POST `/api/auth/register` - Register user successfully
- [ ] POST `/api/auth/login` - Login and get JWT token
- [ ] POST `/api/auth/refresh` - Refresh token works
- [ ] POST `/api/auth/logout` - Logout returns success

### Product Tests
- [ ] GET `/api/products?page=1&limit=10` - Pagination works
- [ ] GET `/api/products?search=test` - Search works
- [ ] GET `/api/products/:id` - Get single product (requires actual ID)

### Cart Tests (Requires Auth Token)
- [ ] GET `/api/cart` - Get empty cart
- [ ] POST `/api/cart/items` - Add item to cart
- [ ] GET `/api/cart` - Cart contains item
- [ ] PATCH `/api/cart/items/:itemId` - Update quantity
- [ ] DELETE `/api/cart/items/:itemId` - Remove item
- [ ] DELETE `/api/cart` - Clear cart

### Order Tests (Requires Auth Token)
- [ ] POST `/api/orders` - Create order (with cart items)
- [ ] GET `/api/orders` - Get user's orders
- [ ] GET `/api/orders/:orderId` - Get order details

### Inventory Tests
- [ ] POST `/api/inventory/check-stock` - Check stock (public)
- [ ] GET `/api/inventory/low-stock` - Get low stock (requires auth)

## ✅ Postman Setup

- [ ] Opened Postman
- [ ] Created new workspace
- [ ] Imported `postman-collection.json`
- [ ] Set `baseUrl` variable to `http://localhost:5000`
- [ ] Successfully ran sample requests
- [ ] Updated `token` variable after login

## ✅ Sample Data (Optional)

- [ ] Run `node sample-data.js`
- [ ] Sample data inserted successfully
- [ ] Verified data in Supabase dashboard
- [ ] Products visible in `/api/products` endpoint

## ✅ Frontend Integration Setup

- [ ] Frontend project ready
- [ ] CORS_ORIGIN updated to frontend URL (if different)
- [ ] API base URL configured in frontend
- [ ] Authentication header setup in frontend
- [ ] Request/response handling configured

## ✅ Production Preparation

- [ ] Environment set to `NODE_ENV=production`
- [ ] All secrets in `.env` are strong
- [ ] `.env` file in `.gitignore`
- [ ] `.env` file NOT committed to git
- [ ] Database backups enabled in Supabase
- [ ] Error logging configured
- [ ] CORS_ORIGIN set to production domain
- [ ] HTTPS certificate obtained
- [ ] Stripe webhooks configured to production URL

## ✅ Deployment

### Docker Deployment
- [ ] Docker installed locally
- [ ] Build image: `docker build -t zj-vestiaro-backend .`
- [ ] Run container: `docker run -p 5000:5000 zj-vestiaro-backend`
- [ ] Container running successfully

### Cloud Deployment
- [ ] Choose cloud provider (Heroku, Railway, AWS, etc.)
- [ ] Create account and project
- [ ] Configure environment variables
- [ ] Deploy backend
- [ ] Test production endpoints
- [ ] Configure monitoring

## ✅ Monitoring & Maintenance

- [ ] Set up error logging (Sentry recommended)
- [ ] Set up performance monitoring
- [ ] Configure database backups
- [ ] Plan dependency update schedule
- [ ] Document API changes
- [ ] Create runbook for issues
- [ ] Set up uptime monitoring

## 📋 Final Verification

- [ ] All core features working
- [ ] All endpoints tested
- [ ] Database connected and working
- [ ] Authentication working
- [ ] Cart functionality working
- [ ] Orders working
- [ ] Payments integrated (Stripe test mode)
- [ ] Inventory tracking working
- [ ] Error handling working
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Ready for frontend integration

## 🚀 Launch Readiness

- [ ] Backend fully functional
- [ ] Frontend ready to integrate
- [ ] Database configured and populated
- [ ] Payment processing tested
- [ ] Email service ready (optional)
- [ ] Analytics configured (optional)
- [ ] CDN configured (optional)
- [ ] Load testing completed (optional)

## 📝 Documentation Reviewed

- [ ] README.md read and understood
- [ ] QUICKSTART.md completed
- [ ] API-TESTING.md reviewed
- [ ] PROJECT-STRUCTURE.md understood
- [ ] COMPLETION-SUMMARY.md reviewed
- [ ] CODE comments understood

## 🎉 Ready to Launch!

If all checkboxes are marked, your Z&J's Vestiaro backend is ready for:
- ✅ Development
- ✅ Testing
- ✅ Frontend Integration
- ✅ Production Deployment

---

## 🆘 Troubleshooting Guide

### Server won't start
- Check Node version: `node --version` (should be 16+)
- Check dependencies: `npm install`
- Check `.env` file exists and has correct values
- Check port 5000 is available

### Database connection error
- Verify Supabase credentials in `.env`
- Check Supabase project is active
- Check network connectivity
- Verify database schema is created

### Authentication errors
- Ensure `JWT_SECRET` is set in `.env`
- Check token format: `Bearer <token>`
- Verify user exists in database

### Stripe errors
- Verify Stripe keys are correct
- Check Stripe test mode is active
- Use Stripe test cards for testing

### CORS errors
- Verify `CORS_ORIGIN` is set correctly
- Check frontend URL matches CORS_ORIGIN
- Verify credentials flag in frontend requests

### Database queries fail
- Check SQL syntax
- Verify tables are created
- Check user permissions
- Review Supabase logs

---

**Last Updated:** 2025-05-20
**Status:** ✅ Production Ready
