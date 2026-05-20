// API Testing and Monitoring

## Available Endpoints

### Health & Info
- `GET /` - API info and available endpoints
- `GET /health` - Server health check

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Products (Public - no auth required)
- `GET /api/products` - List products with pagination, search, filter
- `GET /api/products/categories` - Get all categories
- `GET /api/products/:id` - Get product details

### Products (Admin - requires auth)
- `POST /api/products` - Create new product
- `PATCH /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Shopping Cart (Requires auth)
- `GET /api/cart` - Get user's shopping cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/items/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear entire cart

### Orders (Requires auth)
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details
- `PATCH /api/orders/:orderId/status` - Update order status (admin)
- `POST /api/orders/:orderId/cancel` - Cancel order

### Payments (Requires auth)
- `POST /api/payments/confirm` - Confirm Stripe payment
- `POST /api/payments/refund` - Refund order
- `POST /api/payments/webhook/stripe` - Stripe webhook (no auth needed)

### Inventory
- `GET /api/inventory/products/:productId` - Get product inventory
- `POST /api/inventory/check-stock` - Check if in stock (public)
- `GET /api/inventory/low-stock` - Get low stock products (requires auth)
- `PATCH /api/inventory/products/:productId` - Update inventory (requires auth)

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "data": {},
  "error": "error message if applicable"
}
```

## Testing Tips

1. **Use Postman** - Import postman-collection.json
2. **Test unauthenticated endpoints first** - Categories, products
3. **Register and login** - Get JWT token
4. **Use token for protected endpoints** - Add to Authorization header
5. **Test cart workflow** - Add items, view cart, proceed to checkout
6. **Test orders** - Create, track, cancel
7. **Test payments** - Use Stripe test cards:
   - Success: 4242 4242 4242 4242
   - Decline: 4000 0000 0000 0002

## Common Headers

```
Content-Type: application/json
Authorization: Bearer <JWT_TOKEN>
```

## Query Parameters

Products endpoint:
- `search` - Search by name or description
- `category` - Filter by category ID
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `sort` - Sort field (default: created_at)

Orders endpoint:
- `page` - Page number
- `limit` - Items per page
- `status` - Filter by order status

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `409` - Conflict
- `500` - Server error

## Monitoring

- Check `server.js` console logs
- Monitor Supabase dashboard for database activity
- Monitor Stripe dashboard for payment activity
- Set up error tracking (e.g., Sentry)
- Use application performance monitoring (e.g., New Relic)
