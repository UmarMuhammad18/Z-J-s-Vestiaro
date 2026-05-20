# Z&J's Vestiaro Backend - Project Structure

## 📁 File Organization

```
project-root/
├── server.js                      # Express server entry point
├── package.json                   # Dependencies and scripts
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
│
├── config/
│   └── config-database.js         # Supabase database connection
│
├── middleware/
│   ├── middleware-auth.js         # JWT authentication
│   └── middleware-errorHandler.js # Error handling
│
├── controllers/
│   ├── controllers-authController.js      # Auth logic
│   ├── controllers-productController.js   # Product management
│   ├── controllers-cartController.js      # Cart operations
│   ├── controllers-orderController.js     # Order management
│   ├── controllers-paymentController.js   # Payment processing
│   └── controllers-inventoryController.js # Inventory tracking
│
├── routes/
│   ├── routes-auth.js             # Auth endpoints
│   ├── routes-products.js         # Product endpoints
│   ├── routes-cart.js             # Cart endpoints
│   ├── routes-orders.js           # Order endpoints
│   ├── routes-payments.js         # Payment endpoints
│   └── routes-inventory.js        # Inventory endpoints
│
├── utils/
│   ├── utils-validators.js        # Input validation
│   └── utils-stripe.js            # Stripe utilities
│
├── database/
│   └── database-schema.sql        # PostgreSQL schema
│
├── docs/
│   ├── README.md                  # Full documentation
│   ├── QUICKSTART.md              # Quick start guide
│   ├── API-TESTING.md             # Testing guide
│   └── PROJECT-STRUCTURE.md       # This file
│
├── docker/
│   ├── Dockerfile                 # Docker configuration
│   └── docker-compose.yml         # Docker compose
│
└── scripts/
    ├── sample-data.js             # Sample data insertion
    └── install-and-setup.sh       # Setup script
```

## 🔄 Request Flow

```
Client Request
    ↓
Express Server (server.js)
    ↓
Route Handler (routes/*.js)
    ↓
Middleware
  - CORS, Helmet, Rate Limiting
  - Body parsing
  - Authentication (if required)
    ↓
Controller (controllers/*.js)
    ↓
Database Query (Supabase)
    ↓
Response
```

## 📦 Module Breakdown

### Core Modules
1. **Server** - Express app setup, middleware configuration, route mounting
2. **Config** - Database connection and initialization
3. **Middleware** - Authentication, error handling, security

### Controllers
1. **Auth** - User registration, login, token refresh
2. **Products** - CRUD operations for products and categories
3. **Cart** - Shopping cart operations
4. **Orders** - Order creation and management
5. **Payments** - Stripe integration and payment processing
6. **Inventory** - Stock management and tracking

### Database Tables
1. **users** - User accounts and authentication
2. **categories** - Product categories
3. **products** - Product information
4. **product_variants** - Sizes, colors, etc.
5. **carts** - Shopping carts
6. **cart_items** - Items in carts
7. **orders** - Customer orders
8. **order_items** - Products in orders
9. **reviews** - Product reviews
10. **wishlist** - Favorite products
11. **inventory** - Inventory audit trail

## 🚀 Deployment Architecture

```
Frontend (React/Vue)
    ↓
API Gateway (Nginx/Vercel)
    ↓
Backend Server (Node.js/Express)
    ↓
Supabase Database (PostgreSQL)
Stripe API
```

## 🔐 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention (Supabase client)
- ✅ HTTPS ready

## 📊 Database Design

- Normalized schema for data integrity
- Foreign key constraints
- Indexes for query performance
- Soft deletes for audit trail
- Timestamp tracking (created_at, updated_at)

## 🔄 API Versioning

Current version: `v1` (implied in `/api/*` routes)

Future versions can be added as `/api/v2/*` routes.

## 📈 Scalability

- Stateless API (can be horizontally scaled)
- Database connection pooling (Supabase)
- Caching ready (Redis can be added)
- Queue system ready (Bull can be added)
- CDN ready for static files

## 🧪 Testing Strategy

1. **Unit Tests** - Individual function testing
2. **Integration Tests** - Database operations
3. **API Tests** - Endpoint testing
4. **End-to-End Tests** - Full user workflows

Use Postman collection for manual testing.

## 🚨 Error Handling

- Centralized error handler
- Consistent error response format
- Request validation at controller level
- Database error handling
- Stripe error handling

## 📝 Logging

- Request logging
- Error logging
- Database query logging (via Supabase)
- Stripe event logging

## 🔧 Configuration Management

- Environment variables via `.env`
- Database configuration centralized
- Route configuration in `server.js`
- Middleware stack in `server.js`

## 🎯 Key Features Implemented

✅ User authentication with JWT
✅ Product catalog with search and filtering
✅ Shopping cart management
✅ Order processing
✅ Stripe payment integration
✅ Inventory tracking
✅ Admin product management
✅ Error handling and validation
✅ Security headers and CORS
✅ Rate limiting
✅ Database schema with migrations
✅ Comprehensive API documentation
✅ Docker support
✅ Postman collection

## 📱 Frontend Integration

The backend provides a complete REST API for:
- User authentication
- Product browsing
- Shopping cart management
- Order placement
- Payment processing
- Account management

See API-TESTING.md for integration examples.

## 🎓 Learning Resources

- Express.js docs: https://expressjs.com
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- JWT: https://jwt.io

## 📞 Support & Maintenance

- Monitor error logs regularly
- Update dependencies monthly
- Review database indexes
- Backup Supabase regularly
- Monitor Stripe account
