// shop.js – Shop Page JavaScript
// Products are loaded from the API or localStorage fallback

let currentFilter = 'all';
let currentSearch = '';
let currentSort = 'default';
let currentAvailability = 'all';
let currentPriceRange = 'all';
let shopProducts = [];

function filterShop(category, button) {
  currentFilter = category;
  document.querySelectorAll('.flt-btn').forEach(btn => btn.classList.remove('active'));
  if (button) button.classList.add('active');
  renderProducts();
}

function handleSearch(value) {
  currentSearch = value.toLowerCase().trim();
  renderProducts();
}

function filterAvailability(value) {
  currentAvailability = value;
  renderProducts();
}

function filterPriceRange(value) {
  currentPriceRange = value;
  renderProducts();
}

function sortShop(value) {
  currentSort = value;
  renderProducts();
}

async function fetchShopProducts() {
  shopProducts = await fetchProductsFromApi();
  return shopProducts;
}

function getShopProductById(productId) {
  return shopProducts.find(p => p.id === Number(productId));
}

async function renderProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  await fetchShopProducts();
  let filtered = currentFilter === 'all'
    ? shopProducts
    : shopProducts.filter(p => p.category === currentFilter);

  if (currentSearch) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(currentSearch)
      || (p.desc || '').toLowerCase().includes(currentSearch)
      || (p.category || '').toLowerCase().includes(currentSearch)
    );
  }

  if (currentAvailability !== 'all') {
    filtered = filtered.filter(p => currentAvailability === 'in-stock' ? p.stock : !p.stock);
  }

  if (currentPriceRange !== 'all') {
    filtered = filtered.filter(p => {
      if (currentPriceRange === 'under-50') return p.price < 50;
      if (currentPriceRange === '50-100') return p.price >= 50 && p.price <= 100;
      if (currentPriceRange === '100-150') return p.price > 100 && p.price <= 150;
      if (currentPriceRange === '150-plus') return p.price > 150;
      return true;
    });
  }

  if (currentSort === 'price-asc') {
    filtered = filtered.slice().sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered = filtered.slice().sort((a, b) => b.price - a.price);
  } else if (currentSort === 'name-asc') {
    filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name));
  } else if (currentSort === 'name-desc') {
    filtered = filtered.slice().sort((a, b) => b.name.localeCompare(a.name));
  } else if (currentSort === 'newest') {
    filtered = filtered.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } else if (currentSort === 'oldest') {
    filtered = filtered.slice().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  } else if (currentSort === 'popularity') {
    filtered = filtered.slice().sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:3rem; color:var(--muted);">
        <div style="font-size:3rem;margin-bottom:1rem;">🔍</div>
        <p>No products match your search.</p>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(product => `
    <div class="prod-card" onclick="openProductModal('${product.id}')">
      <div class="prod-img-wrap">
        <span class="prod-emoji">${product.emoji || '🛍️'}</span>
      </div>
      <div class="prod-info">
        <div class="prod-name">${product.name}</div>
        <div class="prod-meta">${product.category}</div>
        <div class="prod-price">$${Number(product.price).toFixed(2)}</div>
        ${!product.stock ? '<div style="color:#e05555;font-size:0.75rem;letter-spacing:0.1em;margin-top:0.3rem;font-family:\'Josefin Sans\',sans-serif;">OUT OF STOCK</div>' : ''}
      </div>
    </div>
  `).join('');
}

function formatOptionList(label, values) {
  if (!values || !values.length) return '';
  return `<div><span style="font-weight:700; color:var(--white);">${label}:</span> ${values.join(', ')}</div>`;
}

function renderRelatedProducts(product) {
  const related = shopProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);
  const list = document.getElementById('pm-related-list');
  if (!related.length) {
    list.innerHTML = '<div style="color:var(--muted);">No related items found in this category.</div>';
    return;
  }
  list.innerHTML = related.map(item => `
    <button type="button" class="btn-outline" style="display:flex; justify-content:space-between; width:100%; padding:0.85rem 1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.1); background:rgba(255,255,255,0.03); color:var(--white);" onclick="openProductModal('${item.id}')">
      <span>${item.emoji || '🛍️'} ${item.name}</span>
      <span style="opacity:0.8;">$${Number(item.price).toFixed(2)}</span>
    </button>
  `).join('');
}

function openProductModal(productId) {
  const product = getShopProductById(productId);
  if (!product) return;

  document.getElementById('pm-category').textContent    = (product.category || 'Unknown').toUpperCase();
  document.getElementById('pm-name').textContent        = product.name;
  document.getElementById('pm-name').dataset.productId  = productId;
  document.getElementById('pm-gender').textContent      = 'Premium Collection';
  document.getElementById('pm-price').textContent       = `$${Number(product.price).toFixed(2)}`;
  document.getElementById('pm-stock').textContent       = product.stock ? 'In Stock' : 'Out of Stock';
  document.getElementById('pm-stock').className        = product.stock ? 'pm-stock' : 'pm-stock out';
  document.getElementById('pm-description').textContent = product.desc || product.description || 'No description available.';
  const imageContainer = document.getElementById('pm-image');
  if (product.image) {
    imageContainer.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
  } else {
    imageContainer.innerHTML = '';
    imageContainer.textContent = product.emoji || '🛍️';
  }

  const variantsEl = document.getElementById('pm-variants');
  const variantList = document.getElementById('pm-variant-list');
  const variantHtml = [
    formatOptionList('Sizes', product.sizes),
    formatOptionList('Colors', product.colors),
  ].filter(Boolean).join('');
  if (variantHtml) {
    variantsEl.style.display = 'block';
    variantList.innerHTML = variantHtml;
  } else {
    variantsEl.style.display = 'none';
    variantList.innerHTML = '';
  }

  const relatedWrapper = document.getElementById('pm-related');
  renderRelatedProducts(product);
  relatedWrapper.style.display = 'block';

  const cartBtn = document.querySelector('#productModal .btn-gold');
  if (cartBtn) {
    cartBtn.disabled = !product.stock;
    cartBtn.style.opacity = product.stock ? '1' : '0.45';
    cartBtn.title = product.stock ? '' : 'Out of stock';
  }

  document.getElementById('productModal').classList.add('open');
}

// Check for category filter in URL
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const category = params.get('cat');
  if (category) {
    currentFilter = category;
    const btn = Array.from(document.querySelectorAll('.flt-btn'))
      .find(b => b.textContent.toLowerCase() === category.toLowerCase());
    if (btn) {
      btn.classList.add('active');
      document.querySelectorAll('.flt-btn').forEach(b => {
        if (b !== btn) b.classList.remove('active');
      });
    }
  }
  renderProducts();
});

// Close modal on overlay click
document.addEventListener('click', e => {
  const modal = document.getElementById('productModal');
  if (modal && e.target === modal) closeModal();
});
