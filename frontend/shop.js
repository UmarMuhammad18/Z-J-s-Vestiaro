// shop.js - Shop Page JavaScript
const sampleProducts = [
  { id: 1, name: 'Premium Sneakers', category: 'footwear', price: 89.99, emoji: '👟', stock: true, desc: 'Comfortable and stylish sneakers perfect for everyday wear' },
  { id: 2, name: 'Leather Boots', category: 'footwear', price: 129.99, emoji: '🥾', stock: true, desc: 'Classic leather boots with premium quality' },
  { id: 3, name: 'Running Shoes', category: 'footwear', price: 99.99, emoji: '👟', stock: true, desc: 'Performance running shoes for athletes' },
  { id: 4, name: 'Wireless Earbuds', category: 'gadgets', price: 79.99, emoji: '🎧', stock: true, desc: 'Premium noise-cancelling wireless earbuds' },
  { id: 5, name: 'Smart Watch', category: 'gadgets', price: 199.99, emoji: '⌚', stock: true, desc: 'Feature-rich smartwatch with health tracking' },
  { id: 6, name: 'Phone Stand', category: 'gadgets', price: 29.99, emoji: '📱', stock: true, desc: 'Adjustable phone stand for all devices' },
  { id: 7, name: 'Elegant Dress', category: 'clothing', price: 79.99, emoji: '👗', stock: true, desc: 'Beautiful evening dress for special occasions' },
  { id: 8, name: 'Casual T-Shirt', category: 'clothing', price: 29.99, emoji: '👕', stock: true, desc: 'Premium cotton casual t-shirt' },
  { id: 9, name: 'Wool Sweater', category: 'clothing', price: 59.99, emoji: '🧶', stock: true, desc: 'Warm and cozy wool sweater' },
];

let currentFilter = 'all';

function filterShop(category, button) {
  currentFilter = category;
  
  // Update button states
  document.querySelectorAll('.flt-btn').forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');
  
  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  
  const filtered = currentFilter === 'all' 
    ? sampleProducts 
    : sampleProducts.filter(p => p.category === currentFilter);
  
  grid.innerHTML = filtered.map(product => `
    <div class="prod-card" onclick="openProductModal(${product.id})">
      <div class="prod-img-wrap">
        <span class="prod-emoji">${product.emoji}</span>
      </div>
      <div class="prod-info">
        <div class="prod-name">${product.name}</div>
        <div class="prod-meta">${product.category}</div>
        <div class="prod-price">$${product.price.toFixed(2)}</div>
      </div>
    </div>
  `).join('');
}

function openProductModal(productId) {
  const product = sampleProducts.find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById('pm-category').textContent = product.category.toUpperCase();
  document.getElementById('pm-name').textContent = product.name;
  document.getElementById('pm-name').dataset.productId = productId;
  document.getElementById('pm-gender').textContent = 'Premium Collection';
  document.getElementById('pm-price').textContent = `$${product.price.toFixed(2)}`;
  document.getElementById('pm-stock').textContent = product.stock ? 'In Stock' : 'Out of Stock';
  document.getElementById('pm-stock').className = product.stock ? 'pm-stock' : 'pm-stock out';
  document.getElementById('pm-description').textContent = product.desc;
  document.getElementById('pm-image').textContent = product.emoji;
  
  document.getElementById('productModal').classList.add('open');
}

function closeModal() {
  document.getElementById('productModal').classList.remove('open');
}

// Check for category filter in URL
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('cat');
  if (category) {
    currentFilter = category;
    const btn = Array.from(document.querySelectorAll('.flt-btn')).find(
      b => b.textContent.toLowerCase() === category.toLowerCase()
    );
    if (btn) btn.click();
  }
  
  renderProducts();
});

// Close modal on overlay click
document.addEventListener('click', (e) => {
  const modal = document.getElementById('productModal');
  if (e.target === modal) closeModal();
});
