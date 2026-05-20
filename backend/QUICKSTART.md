# Z&J's Vestiaro Backend - Quick Start Guide

## 🎯 Getting Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials:
# - SUPABASE_URL and keys
# - STRIPE_SECRET_KEY
# - JWT_SECRET
```

### Step 3: Create Database Schema
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project → SQL Editor
3. Create new query
4. Copy all SQL from `database-schema.sql`
5. Execute (⌘/Ctrl + Enter)

### Step 4: Start Server
```bash
npm run dev    # Development mode with auto-reload
npm start      # Production mode
```

Server starts at: `http://localhost:5000`

### Step 5: Add Sample Data (Optional)
```bash
node sample-data.js
```

## 🧪 Test Your Setup

### 1. Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"success":true,"message":"Server is running"}
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Save the `accessToken` from response for next steps.

### 4. Get Products
```bash
curl http://localhost:5000/api/products
```

### 5. Get Cart (with token)
```bash
curl http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📱 Using Postman

1. Import `postman-collection.json` into Postman
2. Set `baseUrl` variable to `http://localhost:5000`
3. After login, set `token` variable with your JWT token
4. Test all endpoints

## 🔗 Integration with Frontend

In your frontend (React, Vue, etc.):

```javascript
const API_URL = 'http://localhost:5000/api';

// Login
const response = await fetch(`${API_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

const { data } = await response.json();
const token = data.accessToken;

// Get Cart
const cart = await fetch(`${API_URL}/cart`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🐛 Troubleshooting

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "SUPABASE_URL is not defined"
Check your `.env` file has correct Supabase credentials.

### "Port 5000 already in use"
```bash
# Change PORT in .env or kill process
kill -9 $(lsof -ti:5000)  # macOS/Linux
netstat -ano | findstr :5000  # Windows
```

### Database connection errors
Ensure:
1. Supabase URL and keys are correct
2. Database schema is created (run SQL from database-schema.sql)
3. Network access is allowed

## 📚 API Documentation

See `README.md` for complete API documentation and all endpoints.

## 🚀 Ready for Production?

Before deploying:
1. ✅ Update `.env` with production credentials
2. ✅ Set `NODE_ENV=production`
3. ✅ Enable HTTPS
4. ✅ Update CORS_ORIGIN to your frontend domain
5. ✅ Set strong JWT_SECRET
6. ✅ Test all payment flows with Stripe test keys
7. ✅ Set up error logging and monitoring

## 💡 Tips

- Use `nodemon` for auto-reload during development: `npm run dev`
- Check server logs for debugging
- Use Postman to test endpoints before integrating with frontend
- Keep `.env` secrets safe - never commit to git
- Monitor Supabase usage to avoid overages

---

**Need help?** Check README.md for detailed documentation.
