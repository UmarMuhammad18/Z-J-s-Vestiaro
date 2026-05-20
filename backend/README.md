# Z&J's Vestiaro Backend API

A complete Node.js/Express backend for the Z&J's Vestiaro luxury fashion e-commerce platform with Supabase PostgreSQL database and Stripe payment integration.

## 🚀 Features

- **Authentication**: JWT-based user registration and login
- **Product Management**: Browse, search, and filter luxury fashion items
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Management**: Create, track, and manage orders
- **Payment Processing**: Stripe integration for secure payments
- **Inventory Management**: Real-time stock tracking and low-stock alerts
- **Admin Controls**: Product and inventory management endpoints

## 📋 Prerequisites

- Node.js 16+ and npm
- Supabase account and project
- Stripe account (for payment processing)
- Environment variables configured

## 🔧 Installation

1. **Clone and setup**
```bash
cd your-project
npm install
```

2. **Create `.env` file**
```bash
cp .env.example .env
```

3. **Configure environment variables**
Edit `.env` with your credentials:
```
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-key
STRIPE_SECRET_KEY=your-stripe-key
```

4. **Create database schema**
- Go to Supabase dashboard → SQL Editor
- Copy contents of `database-schema.sql`
- Execute the SQL

5. **Start the server**
```bash
npm start        # Production
npm run dev      # Development with auto-reload
```

Server runs on `http://localhost:5000`

## 📚 API Endpoints

### Authentication `/api/auth`
- `POST /register` - Register new user
- `POST /login` - Login and get JWT tokens
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout

### Products `/api/products`
- `GET /` - List all products (with search, filter, pagination)
- `GET /categories` - Get product categories
- `GET /:id` - Get product details
- `POST /` - Create product (admin)
- `PATCH /:id` - Update product (admin)
- `DELETE /:id` - Delete product (admin)

### Shopping Cart `/api/cart`
- `GET /` - Get user's cart
- `POST /items` - Add item to cart
- `DELETE /items/:itemId` - Remove item
- `PATCH /items/:itemId` - Update item quantity
- `DELETE /` - Clear entire cart

### Orders `/api/orders`
- `POST /` - Create new order
- `GET /` - Get user's orders
- `GET /:orderId` - Get order details
- `PATCH /:orderId/status` - Update order status (admin)
- `POST /:orderId/cancel` - Cancel order

### Payments `/api/payments`
- `POST /confirm` - Confirm Stripe payment
- `POST /refund` - Refund order
- `POST /webhook/stripe` - Stripe webhook handler

### Inventory `/api/inventory`
- `GET /products/:productId` - Get product inventory
- `POST /check-stock` - Check if product is in stock
- `GET /low-stock` - Get products with low stock
- `PATCH /products/:productId` - Update inventory

## 🔐 Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGc..." http://localhost:5000/api/cart
```

## 📝 Request Examples

### Register User
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Get Products with Search
```bash
GET /api/products?search=dress&category=dresses&page=1&limit=20
```

### Add to Cart
```bash
POST /api/cart/items
{
  "productId": "product-uuid",
  "quantity": 2,
  "variant": { "size": "M", "color": "Black" }
}
```

### Create Order
```bash
POST /api/orders
{
  "items": [
    { "product_id": "product-uuid", "quantity": 1 }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA"
  },
  "email": "user@example.com",
  "phone": "+1-555-0000"
}
```

## 🗄️ Database Schema

### Tables
- **users** - User accounts and profiles
- **products** - Product catalog
- **categories** - Product categories
- **product_variants** - Size, color variants
- **carts** - Shopping carts
- **cart_items** - Items in cart
- **orders** - Customer orders
- **order_items** - Products in each order
- **reviews** - Product reviews
- **wishlist** - Saved products
- **inventory** - Inventory audit trail

## ⚙️ Configuration

### Environment Variables
```
NODE_ENV=development
PORT=5000
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
CORS_ORIGIN=http://localhost:3000
```

### CORS Configuration
By default, CORS allows `http://localhost:3000`. Update `CORS_ORIGIN` for production.

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configured in `server.js`

## 🔍 Error Handling

All endpoints return standard response format:
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message if applicable"
}
```

## 🧪 Testing Endpoints

Use Postman, Insomnia, or curl:

```bash
# Health check
curl http://localhost:5000/health

# Get categories
curl http://localhost:5000/api/products/categories

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123","firstName":"Test","lastName":"User"}'
```

## 📦 Dependencies

- **express** - Web framework
- **supabase-js** - Database client
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **stripe** - Payment processing
- **cors** - Cross-origin support
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment configuration

## 🚀 Deployment

### Heroku
```bash
heroku create your-app-name
git push heroku main
```

### Vercel/Netlify
Use serverless functions or deploy Node.js backend separately.

### Docker
```bash
docker build -t zj-vestiaro-backend .
docker run -p 5000:5000 zj-vestiaro-backend
```

## 📄 License

ISC

## 🤝 Contributing

Contributions welcome! Please submit pull requests or open issues.

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Made with ❤️ for Z&J's Vestiaro**
