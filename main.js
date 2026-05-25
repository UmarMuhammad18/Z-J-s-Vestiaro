// main.js - Shared JavaScript for Z&J's Vestiario

// ─── Default product catalogue (used only to seed on first visit) ──────────
const DEFAULT_PRODUCTS = [
  { id: 1, name: 'Premium Sneakers',  category: 'footwear', price: 89.99,  emoji: '👟', stock: true, desc: 'Comfortable and stylish sneakers perfect for everyday wear.', sizes: ['7','8','9','10','11'], colors: ['Black','White','Navy'], popularity: 82, createdAt: 1716800000000 },
  { id: 2, name: 'Leather Boots',     category: 'footwear', price: 129.99, emoji: '🥾', stock: true, desc: 'Classic leather boots crafted with premium quality hide.', sizes: ['6','7','8','9','10'], colors: ['Brown','Tan'], popularity: 68, createdAt: 1716713600000 },
  { id: 3, name: 'Running Shoes',     category: 'footwear', price: 99.99,  emoji: '👟', stock: true, desc: 'Performance running shoes engineered for athletes.', sizes: ['7','8','9','10','11'], colors: ['Grey','Lime'], popularity: 74, createdAt: 1716627200000 },
  { id: 4, name: 'Wireless Earbuds',  category: 'gadgets',  price: 79.99,  emoji: '🎧', stock: true, desc: 'Premium noise-cancelling wireless earbuds.', colors: ['Black','White'], popularity: 90, createdAt: 1716540800000 },
  { id: 5, name: 'Smart Watch',       category: 'gadgets',  price: 199.99, emoji: '⌚', stock: true, desc: 'Feature-rich smartwatch with full health tracking.', colors: ['Black','Silver'], popularity: 83, createdAt: 1716454400000 },
  { id: 6, name: 'Phone Stand',       category: 'gadgets',  price: 29.99,  emoji: '📱', stock: true, desc: 'Adjustable phone stand compatible with all devices.', colors: ['Black','Rose'], popularity: 55, createdAt: 1716368000000 },
  { id: 7, name: 'Elegant Dress',     category: 'clothing', price: 79.99,  emoji: '👗', stock: true, desc: 'Beautiful evening dress for special occasions.', sizes: ['S','M','L'], colors: ['Red','Navy'], popularity: 70, createdAt: 1716281600000 },
  { id: 8, name: 'Casual T-Shirt',    category: 'clothing', price: 29.99,  emoji: '👕', stock: true, desc: 'Premium cotton casual t-shirt.', sizes: ['S','M','L','XL'], colors: ['White','Black'], popularity: 62, createdAt: 1716195200000 },
  { id: 9, name: 'Wool Sweater',      category: 'clothing', price: 59.99,  emoji: '🧶', stock: true, desc: 'Warm and cosy wool sweater.', sizes: ['M','L'], colors: ['Green','Beige'], popularity: 59, createdAt: 1716108800000 },
];

// ─── Product Store (localStorage-backed) ──────────────────────────────────
function getProducts() {
  const stored = localStorage.getItem('zj_products');
  if (stored) return JSON.parse(stored);
  // First visit: seed with defaults
  saveProducts(DEFAULT_PRODUCTS);
  return DEFAULT_PRODUCTS;
}

function saveProducts(products) {
  localStorage.setItem('zj_products', JSON.stringify(products));
}

function getNextProductId() {
  const products = getProducts();
  return products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

const API_BASE_URL = (() => {
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  return `${window.location.protocol}//${window.location.host}/api`;
})();

const CART_KEY = 'zj_cart';

function getAuthToken() {
  return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
}

function setAuthSession({ accessToken, refreshToken, email }, remember = false) {
  if (remember) {
    localStorage.setItem('authToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('authEmail', email);
    localStorage.setItem('userRole', 'admin');
  } else {
    sessionStorage.setItem('authToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
    sessionStorage.setItem('authEmail', email);
    sessionStorage.setItem('userRole', 'admin');
  }
}

function clearAuthSession() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authEmail');
  localStorage.removeItem('userRole');
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('refreshToken');
  sessionStorage.removeItem('authEmail');
  sessionStorage.removeItem('userRole');
}

function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API error ${response.status}`);
  }
  return response.json();
}

async function fetchProductsFromApi() {
  try {
    const response = await apiRequest('/products');
    if (response.success && response.data?.products) {
      return response.data.products.map((product) => ({
        ...product,
        category: product.category?.name || product.category_id || product.category || 'Unknown',
        stock: Boolean(product.stock),
        popularity: product.popularity || 0,
        createdAt: product.createdAt || Date.now(),
      }));
    }
  } catch (error) {
    console.warn('Product API fetch failed:', error);
  }

  return getProducts();
}

async function createProductApi(product) {
  try {
    const response = await apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify({
        ...product,
        category: product.category,
      }),
    });
    if (response.success) {
      return {
        ...response.data,
        category: response.data.category?.name || product.category,
        stock: Boolean(response.data.stock),
      };
    }
    throw new Error(response.error || 'Create failed');
  } catch (error) {
    console.warn('Product API create failed:', error);
    const products = getProducts();
    const localProduct = {
      ...product,
      id: getNextProductId(),
      popularity: product.popularity || 0,
      createdAt: product.createdAt || Date.now(),
    };
    products.push(localProduct);
    saveProducts(products);
    return localProduct;
  }
}

async function updateProductApi(id, updates) {
  try {
    const response = await apiRequest(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...updates, category: updates.category }),
    });
    if (response.success) {
      return {
        ...response.data,
        category: response.data.category?.name || updates.category,
        stock: Boolean(response.data.stock),
      };
    }
    throw new Error(response.error || 'Update failed');
  } catch (error) {
    console.warn('Product API update failed:', error);
    const products = getProducts();
    const index = products.findIndex((p) => p.id === Number(id));
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      saveProducts(products);
      return products[index];
    }
    throw error;
  }
}

async function deleteProductApi(id) {
  try {
    const response = await apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
    if (response.success) return true;
    throw new Error(response.error || 'Delete failed');
  } catch (error) {
    console.warn('Product API delete failed:', error);
    const products = getProducts().filter((p) => p.id !== Number(id));
    saveProducts(products);
    return true;
  }
}

// ─── Cart helpers ──────────────────────────────────────────────────────────
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const cart = getCart();
  const total = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = total || '';
    el.style.display = total ? 'flex' : 'none';
  });
  renderCartPreview();
}

function getCartPreviewHtml(cart) {
  if (!cart.length) {
    return `
      <div class="cart-preview-empty">
        <p>Your cart is empty.</p>
        <button class="btn-outline" onclick="window.location.href='shop.html'">Shop Now</button>
      </div>
    `;
  }

  return `
    <div class="cart-preview-header">
      <span>Cart Preview</span>
      <span>${cart.length} item${cart.length > 1 ? 's' : ''}</span>
    </div>
    <div class="cart-preview-items">
      ${cart.map(item => `
        <div class="cart-preview-item">
          <div class="cart-preview-meta">
            <div class="cart-preview-title">${item.name}</div>
            <div class="cart-preview-sub">${item.quantity} × $${Number(item.price).toFixed(2)}</div>
          </div>
          <div class="cart-preview-total">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}
    </div>
    <div class="cart-preview-actions">
      <button class="btn-outline" onclick="window.location.href='cart.html'">View Cart</button>
      <button class="btn-gold" onclick="window.location.href='checkout.html'">Checkout</button>
    </div>
  `;
}

function renderCartPreview() {
  let preview = document.getElementById('cartPreview');
  if (!preview) {
    const nav = document.querySelector('#main-nav');
    if (!nav) return;
    preview = document.createElement('div');
    preview.id = 'cartPreview';
    preview.className = 'cart-preview';
    nav.appendChild(preview);
  }
  const cart = getCart();
  preview.innerHTML = getCartPreviewHtml(cart);
}

function initializeCartPreview() {
  const cartLink = document.querySelector('a[href="cart.html"]');
  const preview = document.getElementById('cartPreview');
  if (!cartLink || !preview) return;

  cartLink.addEventListener('mouseenter', () => {
    renderCartPreview();
    preview.classList.add('open');
  });
  cartLink.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!preview.matches(':hover')) preview.classList.remove('open');
    }, 150);
  });
  preview.addEventListener('mouseleave', () => preview.classList.remove('open'));
  preview.addEventListener('mouseenter', () => preview.classList.add('open'));
}

function addToCart() {
  const cart = getCart();
  const productId = Number(document.getElementById('pm-name').dataset.productId);
  const availableProducts = (typeof shopProducts !== 'undefined' && shopProducts.length)
    ? shopProducts
    : getProducts();
  const product = availableProducts.find(p => Number(p.id) === productId);
  if (!product) return;

  const cartItem = cart.find(item => item.id === product.id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  showToast('Added to cart!');
  closeModal();
}

function addProductToCart(productId) {
  const cart = getCart();
  const product = getProducts().find(p => Number(p.id) === Number(productId));
  if (!product) {
    showToast('Product not found.', 'error');
    return;
  }

  const cartItem = cart.find(item => item.id === product.id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  showToast('Added to cart!');
}

// ─── Auth helpers ──────────────────────────────────────────────────────────
function isOwnerLoggedIn() {
  return !!getAuthToken();
}

function logout() {
  clearAuthSession();
  window.location.href = 'login.html';
}

// ─── UI helpers ───────────────────────────────────────────────────────────
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position:fixed; bottom:1.8rem; right:1.8rem; z-index:9999;
    background:${type === 'error' ? '#b91c1c' : 'var(--gold)'};
    color:${type === 'error' ? '#fff' : 'var(--black)'};
    padding:0.82rem 1.3rem;
    font-family:'Josefin Sans',sans-serif;
    font-size:0.78rem; letter-spacing:0.14em; text-transform:uppercase;
    border-radius:6px; box-shadow:0 4px 20px rgba(0,0,0,0.4);
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function closeModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('open');
}

// ─── Active nav link ───────────────────────────────────────────────────────
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.href.includes(currentPage));
  });
}

// ─── Init ──────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  updateCartBadge();
  initializeCartPreview();
  initializeMobileMenu();
});

function initializeMobileMenu() {
  const nav = document.querySelector('#main-nav');
  const links = nav?.querySelector('.nav-links');
  if (!nav || !links) return;

  let toggle = nav.querySelector('.nav-toggle');
  if (!toggle) {
    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-toggle';
    toggle.innerHTML = '☰';
    nav.insertBefore(toggle, links);
  }

  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      links.classList.remove('open');
    }
  });
}
