# Z&J's Vestiario — Multi-Page Frontend Guide

## 📋 Overview

The frontend has been converted from a single-page application (SPA) to a proper multi-page website with separate HTML files, each with dedicated content and functionality. All pages share a unified design system through a centralized CSS stylesheet.

## 🎨 Pages & Structure

### Pages Created

| Page | Purpose | Key Features |
|------|---------|--------------|
| **index.html** | Homepage & entry point | Hero section, category cards, featured products, marquee, promise section |
| **shop.html** | Product browsing | Category filtering, product grid, product detail modal, search integration ready |
| **about.html** | Company story & values | Hero with story, statistics, mission cards (quality, delivery, guarantee) |
| **contact.html** | Contact & support | Contact form, business hours, multiple contact channels, location info |
| **cart.html** | Shopping cart | Cart items display, quantity management, order summary, checkout redirection |
| **checkout.html** | Payment & order | Shipping info form, order summary, payment method selection, WhatsApp integration |
| **login.html** | Owner authentication | Email/password login form, demo credentials, role-based access |

### Navigation Structure

```
Home
├── Shop (with filtering by category: footwear, gadgets, clothing)
├── About
├── Contact
├── Cart (🛍️)
└── Owner Login
```

## 🎯 Features by Page

### Home (index.html)
- **Hero Section**: Large title with CTA buttons
- **Category Cards**: 3 clickable cards (Footwear, Gadgets, Clothing) that link to filtered shop
- **Marquee**: Animated ticker with benefits
- **Promise Strip**: Quality badges and value proposition
- **Featured Products**: Dynamically loaded sample products
- **Navigation**: Active "Home" link in navbar

### Shop (shop.html)
- **Filter Bar**: Buttons to filter by All / Footwear / Gadgets / Clothing
- **Product Grid**: Responsive 4-column layout (mobile: 1 column)
- **Product Cards**: Product name, category, price, emoji icon
- **Product Modal**: Click to view details, add to cart, see stock status
- **URL Parameters**: Supports `?cat=footwear` to pre-filter
- **Add to Cart**: Saves to localStorage with quantity

### About (about.html)
- **Hero Section**: Company story with mission statement
- **Stats Row**: 500+ products, 3 categories, 100% satisfaction
- **Promise Quote**: Brand tagline
- **Mission Cards**: 3 cards (Curated Selection, Fast Delivery, Quality Promise)
- **Call-to-Action**: Button to explore collection

### Contact (contact.html)
- **Two-Column Layout**: Left (info & hours), Right (form)
- **Contact Form**: Name, email, subject, message
- **Business Info**: Address, phone, WhatsApp, email
- **Business Hours**: Monday-Friday, Saturday, Sunday info
- **Responsive**: Single column on mobile

### Cart (cart.html)
- **Cart Items**: Display all items with quantity controls
- **Item Actions**: Increase/decrease quantity, remove item
- **Order Summary**: Subtotal, shipping (free), tax (5%), total
- **Empty State**: "Your cart is empty" message
- **Actions**: Checkout button, continue shopping link

### Checkout (checkout.html)
- **Two-Column Layout**: Shipping form (left), order summary (right)
- **Shipping Form**: Name, email, phone, address, city, state, postal code
- **Payment Methods**: WhatsApp (default), Card payment (coming soon)
- **Order Summary**: Lists cart items with individual totals
- **WhatsApp Integration**: Creates pre-formatted message with order details
- **Post-Order**: Clears cart and redirects to home

### Login (login.html)
- **Centered Login Form**: Email and password fields
- **Demo Credentials**: Pre-filled hints (admin@example.com / password123)
- **Remember Me**: Checkbox option
- **Auth**: Stores token in localStorage, sets user role
- **Back Link**: Navigation back to homepage

## 💾 CSS Architecture

### File: styles.css

A single 17.2 KB stylesheet with:
- **Design Tokens** (colors, typography, transitions)
- **Component Styles** (buttons, forms, grids)
- **Page-Specific Styles** (hero, shop, about, contact, modals, footer)
- **Responsive Design**: Mobile breakpoint at 900px
- **CSS Custom Properties**: All values centralized in :root

### Key CSS Variables
```css
--gold: #c9a84c          /* Primary accent */
--black: #0a0a0a         /* Background */
--surface: #111111       /* Card backgrounds */
--white: #f5f3f0         /* Text */
--muted: rgba(..., 0.55) /* Secondary text */
--tr: 0.35s ease         /* Transition duration */
```

## 🔧 JavaScript Modules

### main.js (Shared Utilities)
- **setActiveNav()**: Highlights current page in navigation
- **addToCart()**: Adds products to localStorage
- **showToast()**: Displays notifications
- **closeModal()**: Closes product detail modal
- **Sample Product Data**: Demo products array

### shop.js (Shop Page)
- **filterShop()**: Filters products by category
- **renderProducts()**: Renders product grid
- **openProductModal()**: Shows product details
- **URL Parameter Parsing**: Handles `?cat=category` filters
- **Modal Population**: Sets product info in modal

## 📱 Responsive Design

### Mobile First Approach (900px Breakpoint)
- **Desktop**: Full layout with multiple columns
- **Mobile**: Single column, simplified navigation
- **Flexbox/Grid**: Modern layout techniques
- **Touch-Friendly**: Buttons sized for mobile interaction

### Media Query Example
```css
@media (max-width: 900px) {
  .contact-wrap { grid-template-columns: 1fr; }
  .nav-links { display: none; }
  /* ... more adjustments */
}
```

## 🛒 Shopping Features

### Cart Persistence
- **localStorage**: Cart items persist across page navigation
- **Format**: `{ id, name, price, emoji, category, quantity }`
- **Operations**: Add, remove, update quantity

### Product Modal
- **Trigger**: Click on product card
- **Display**: Product image (emoji), name, price, stock status, description
- **Actions**: Add to cart, WhatsApp order link
- **Close**: Click X button or modal overlay

### Order Flow
1. Browse products on Shop page
2. Click product → Modal opens
3. Add to cart → Toast notification
4. Navigate to Cart
5. Review/modify quantities
6. Click "Proceed to Checkout"
7. Enter shipping info
8. Choose payment method (WhatsApp recommended)
9. Submit → WhatsApp pre-filled order message
10. Cart clears, redirect to home

## 🔐 Authentication

### Login System
- **Demo Mode**: Use credentials `admin@example.com` / `password123`
- **localStorage**: Stores `authToken` and `userRole`
- **Token Format**: `demo-token-` + timestamp
- **Integration Ready**: Backend API auth can replace demo logic

## 🌐 Backend Integration Ready

Current frontend uses demo/sample data. To integrate with backend:

### Products API
```javascript
// Replace sample data with API call:
fetch('/api/products?category=footwear')
  .then(r => r.json())
  .then(products => renderProducts(products))
```

### Cart Management
```javascript
// POST to backend instead of localStorage:
fetch('/api/cart/items', {
  method: 'POST',
  body: JSON.stringify({ productId, quantity })
})
```

### Order Processing
```javascript
// Send order to backend before WhatsApp:
fetch('/api/orders', {
  method: 'POST',
  body: JSON.stringify(orderData)
})
```

## 📁 File Organization

```
Z-J-s-Vestiaro/
├── index.html           (Homepage)
├── shop.html            (Product browsing)
├── about.html           (Company info)
├── contact.html         (Contact form)
├── cart.html            (Shopping cart)
├── checkout.html        (Payment)
├── login.html           (Owner auth)
├── styles.css           (Shared stylesheet)
├── main.js              (Shared utilities)
├── shop.js              (Shop page logic)
└── Z&J's.png            (Logo/favicon)
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build process required
- No dependencies (vanilla JavaScript)

### Running Locally
1. Open `index.html` in a browser
2. Or run a local server: `python -m http.server 8000`
3. Navigate to `http://localhost:8000`

### Demo Features
- All pages load instantly
- Sample products in shop
- Working shopping cart with localStorage
- Contact form submissions (alert only)
- WhatsApp integration for orders
- Demo login (any credentials work)

## 🎯 Customization

### Colors
Update `--gold`, `--black`, `--white` in `styles.css` :root

### Products
Replace `sampleProducts` array in `shop.js` and `index.html` scripts with API calls

### Contact Info
Update footer and contact page with real business information

### Navigation
Add/remove links in navbar across all pages

## 📝 Notes

- All pages are self-contained HTML files (no routing library needed)
- CSS is external and shared across all pages for consistency
- JavaScript is vanilla (no frameworks or build tools)
- Mobile-responsive and fully functional
- Ready for backend API integration

## 🔄 Next Steps

1. **Backend Integration**: Connect to `/api/products`, `/api/cart`, `/api/orders`
2. **Image Management**: Replace emoji icons with product images from Supabase Storage
3. **Real Authentication**: Replace demo login with JWT tokens
4. **Payment Processing**: Integrate Stripe for card payments
5. **Analytics**: Add tracking for user behavior
6. **SEO**: Optimize meta tags and add structured data

---

**Built with ❤️ for Z&J's Vestiario**
