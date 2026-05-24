// main.js - Shared JavaScript
const API_URL = 'http://localhost:5000/api';

// Sample products for demo (replace with API calls)
const sampleProducts = [
  { id: 1, name: 'Premium Sneakers', category: 'footwear', price: 89.99, emoji: '👟', stock: true },
  { id: 2, name: 'Leather Boots', category: 'footwear', price: 129.99, emoji: '🥾', stock: true },
  { id: 3, name: 'Running Shoes', category: 'footwear', price: 99.99, emoji: '👟', stock: true },
  { id: 4, name: 'Wireless Earbuds', category: 'gadgets', price: 79.99, emoji: '🎧', stock: true },
  { id: 5, name: 'Smart Watch', category: 'gadgets', price: 199.99, emoji: '⌚', stock: true },
  { id: 6, name: 'Phone Stand', category: 'gadgets', price: 29.99, emoji: '📱', stock: true },
  { id: 7, name: 'Elegant Dress', category: 'clothing', price: 79.99, emoji: '👗', stock: true },
  { id: 8, name: 'Casual T-Shirt', category: 'clothing', price: 29.99, emoji: '👕', stock: true },
  { id: 9, name: 'Wool Sweater', category: 'clothing', price: 59.99, emoji: '🧶', stock: true },
];

// Set active nav link
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.href.includes(currentPage)) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', setActiveNav);

// Add to cart function
function addToCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const productId = document.getElementById('pm-name').dataset.productId;
  const product = sampleProducts.find(p => p.id == productId);
  
  const cartItem = cart.find(item => item.id === product.id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast('Added to cart!');
  closeModal();
}

// Show toast notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast visible';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '1.8rem';
  toast.style.right = '1.8rem';
  toast.style.zIndex = '9999';
  toast.style.background = 'var(--gold)';
  toast.style.color = 'var(--black)';
  toast.style.padding = '0.82rem 1.3rem';
  toast.style.fontFamily = '\'Josefin Sans\', sans-serif';
  toast.style.fontSize = '0.6rem';
  toast.style.letterSpacing = '0.18em';
  toast.style.textTransform = 'uppercase';
  toast.style.borderRadius = '4px';
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
}

// Close modal
function closeModal() {
  const modal = document.getElementById('productModal');
  if (modal) modal.classList.remove('open');
}
