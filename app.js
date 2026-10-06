/**
 * ============================================================================
 * YAMATO SHOKUDŌ - POINT OF SALE (POS) SYSTEM
 * Authentic Japanese Eats & Street Dining
 * ============================================================================
 */

// Default Brand Menu derived from Yamato Shokudo's official menu
const DEFAULT_MENU = [
  {
    id: 'item-1',
    name: 'Torikatsu Curry',
    category: 'Main Bowls',
    price: 160,
    desc: 'Crispy chicken cutlet served with rice and rich Japanese curry sauce.',
    img: 'assets/torikatsu_curry.jpg',
    bestSeller: true
  },
  {
    id: 'item-2',
    name: 'Katsudon',
    category: 'Main Bowls',
    price: 165,
    desc: 'Crispy chicken cutlet simmered with egg and onions over a bowl of steamed rice.',
    img: 'assets/katsudon.jpg',
    bestSeller: false
  },
  {
    id: 'item-3',
    name: 'Teriyaki Katsu',
    category: 'Main Bowls',
    price: 150,
    desc: 'Crispy breaded cutlet glazed with sweet and savory teriyaki sauce, served over rice.',
    img: 'assets/teriyaki_katsu.jpg',
    bestSeller: false
  },
  {
    id: 'item-4',
    name: 'Gyudon',
    category: 'Main Bowls',
    price: 180,
    desc: 'Thinly sliced beef and onions simmered in a savory sauce, served over steamed rice.',
    img: 'assets/gyudon.jpg',
    bestSeller: false
  },
  {
    id: 'item-5',
    name: 'Extra Rice',
    category: 'Add-Ons',
    price: 30,
    desc: 'Bowl of fluffy steamed Japanese white rice.',
    img: 'assets/logo.png',
    bestSeller: false
  },
  {
    id: 'item-6',
    name: 'Extra Egg',
    category: 'Add-Ons',
    price: 25,
    desc: 'Fresh farm egg, simmered or sunny side-up.',
    img: 'assets/logo.png',
    bestSeller: false
  },
  {
    id: 'item-7',
    name: 'Curry Sauce',
    category: 'Add-Ons',
    price: 50,
    desc: 'Extra portion of rich, aromatic Japanese curry sauce.',
    img: 'assets/torikatsu_curry.jpg',
    bestSeller: false
  },
  {
    id: 'item-8',
    name: 'Teriyaki Sauce',
    category: 'Add-Ons',
    price: 30,
    desc: 'Extra sweet and savory teriyaki glaze.',
    img: 'assets/teriyaki_katsu.jpg',
    bestSeller: false
  },
  {
    id: 'item-9',
    name: 'Coleslaw w/ Roasted Sesame Mayo',
    category: 'Sides',
    price: 80,
    desc: 'Fresh shredded cabbage tossed in Japanese roasted sesame dressing.',
    img: 'assets/logo.png',
    bestSeller: false
  },
  {
    id: 'item-10',
    name: 'Potato Wedges',
    category: 'Sides',
    price: 100,
    desc: 'Crispy golden seasoned potato wedges with dipping sauce.',
    img: 'assets/logo.png',
    bestSeller: false
  },
  {
    id: 'item-11',
    name: 'Red Tea Soda',
    category: 'Beverages',
    price: 80,
    desc: 'Sparkling iced red tea with refreshing botanical fizz.',
    img: 'assets/melon_soda.jpg',
    bestSeller: false
  },
  {
    id: 'item-12',
    name: 'Melon Cream Soda',
    category: 'Beverages',
    price: 100,
    desc: 'Classic vibrant green Japanese melon soda topped with vanilla ice cream and cherry.',
    img: 'assets/melon_soda.jpg',
    bestSeller: true
  },
  {
    id: 'item-13',
    name: 'Chocolate Ice Cream',
    category: 'Desserts',
    price: 45,
    desc: 'Creamy rich chocolate ice cream scoop.',
    img: 'assets/matcha_icecream.jpg',
    bestSeller: false
  },
  {
    id: 'item-14',
    name: 'Matcha Ice Cream',
    category: 'Desserts',
    price: 50,
    desc: 'Authentic rich Japanese Uji green tea matcha ice cream scoop.',
    img: 'assets/matcha_icecream.jpg',
    bestSeller: true
  }
];

// Default Category List
const DEFAULT_CATEGORIES = [
  'Main Bowls',
  'Add-Ons',
  'Sides',
  'Beverages',
  'Desserts',
  'Specials'
];

// App State
class PosState {
  constructor() {
    this.customCategories = this.loadCategories();
    this.catalog = this.loadCatalog();
    this.cart = [];
    this.salesHistory = this.loadSalesHistory();
    this.activeCategory = 'All';
    this.searchQuery = '';
    this.manageMode = false;
    this.orderType = 'Dine In';
    this.tableNum = '';
    this.discountPercent = 0;
    this.orderSeq = parseInt(localStorage.getItem('yamato_order_seq') || '101', 10);
    this.selectedItemForNote = null;
    this.activePaymentMethod = 'Cash';
    this.ordersFilter = 'Pending';

    // Sales Dashboard Date Filtering & Interactive Calendar
    const today = new Date();
    const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    this.salesFilterPreset = 'today';
    this.salesStartDate = todayIso;
    this.salesEndDate = todayIso;
    this.calViewYear = today.getFullYear();
    this.calViewMonth = today.getMonth();
    this.calDraftStart = todayIso;
    this.calDraftEnd = todayIso;
    this.calPickingPhase = 'start';
  }

  loadCategories() {
    const saved = localStorage.getItem('yamato_pos_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading saved categories:', e);
      }
    }
    return [...DEFAULT_CATEGORIES];
  }

  saveCategories() {
    localStorage.setItem('yamato_pos_categories', JSON.stringify(this.customCategories));
  }

  loadCatalog() {
    const saved = localStorage.getItem('yamato_pos_catalog');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Error loading saved catalog:', e);
      }
    }
    return [...DEFAULT_MENU];
  }

  saveCatalog() {
    localStorage.setItem('yamato_pos_catalog', JSON.stringify(this.catalog));
  }

  loadSalesHistory() {
    const saved = localStorage.getItem('yamato_pos_sales');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Normalize older records without status to 'Completed'
          return parsed.map(ord => ({
            ...ord,
            status: ord.status || 'Completed'
          }));
        }
      } catch (e) {
        console.error('Error loading sales history:', e);
      }
    }
    return [];
  }

  saveSalesHistory() {
    localStorage.setItem('yamato_pos_sales', JSON.stringify(this.salesHistory));
  }

  nextOrderNumber() {
    this.orderSeq += 1;
    localStorage.setItem('yamato_order_seq', this.orderSeq.toString());
    return `#${this.orderSeq.toString().padStart(4, '0')}`;
  }
}

const state = new PosState();

// ============================================================================
// AUDIO (SILENCED)
// ============================================================================
const AudioEngine = {
  playTap() {},
  playChime() {},
  playDelete() {}
};

// ============================================================================
// UI HELPERS & TOASTS
// ============================================================================
function showToast(message, icon = 'fa-check-circle') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid ${icon}" style="color: var(--primary-red);"></i> <span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 2400);
}

function formatCurrency(amount) {
  return '₱' + parseFloat(amount || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ============================================================================
// CATALOG & CATEGORY RENDERING & MANAGEMENT
// ============================================================================
function getRawCategoriesList() {
  const set = new Set(state.customCategories || []);
  state.catalog.forEach(i => {
    if (i.category && i.category !== 'All') {
      set.add(i.category);
    }
  });
  return Array.from(set).filter(Boolean);
}

function getCategories() {
  return ['All', ...getRawCategoriesList()];
}

function renderCategoriesBar() {
  const bar = document.getElementById('categories-bar');
  if (!bar) return;

  const categories = getCategories();
  const pillsHtml = categories.map(cat => {
    const count = cat === 'All' 
      ? state.catalog.length 
      : state.catalog.filter(i => i.category === cat).length;
    
    const activeClass = state.activeCategory === cat ? 'active' : '';
    return `
      <button class="category-pill ${activeClass}" data-cat="${escapeHtml(cat)}">
        <span>${escapeHtml(cat)}</span>
        <span class="pill-count">${count}</span>
      </button>
    `;
  }).join('');

  const managePillHtml = `
    <button class="category-pill manage-cat-pill" id="btn-open-manage-categories" title="Manage Categories (Add, Edit, Delete)">
      <i class="fa-solid fa-sliders"></i>
      <span>Categories</span>
    </button>
  `;

  bar.innerHTML = pillsHtml + managePillHtml;

  // Event listeners for category pills
  bar.querySelectorAll('.category-pill:not(.manage-cat-pill)').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.playTap();
      state.activeCategory = btn.dataset.cat;
      renderCategoriesBar();
      renderCatalog();
    });
  });

  document.getElementById('btn-open-manage-categories')?.addEventListener('click', () => {
    AudioEngine.playTap();
    openCategoriesModal();
  });
}

function renderCatalog() {
  const grid = document.getElementById('items-grid');
  const emptyState = document.getElementById('empty-catalog-state');
  if (!grid) return;

  let items = state.catalog;

  // Filter by category
  if (state.activeCategory !== 'All') {
    items = items.filter(i => i.category === state.activeCategory);
  }

  // Filter by search query
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase().trim();
    items = items.filter(i => 
      i.name.toLowerCase().includes(q) || 
      (i.desc && i.desc.toLowerCase().includes(q)) ||
      (i.category && i.category.toLowerCase().includes(q))
    );
  }

  if (items.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = 'flex';
    return;
  }

  emptyState.style.display = 'none';

  grid.innerHTML = items.map(item => {
    const cartItem = state.cart.find(c => c.item.id === item.id);
    const inCartQty = cartItem ? cartItem.qty : 0;
    const isManage = state.manageMode;

    return `
      <div class="dish-card" data-id="${item.id}">
        <div class="dish-img-container">
          <img src="${item.img || 'assets/logo.png'}" alt="${escapeHtml(item.name)}" class="dish-img" onerror="this.src='assets/logo.png'">
          ${item.bestSeller ? '<div class="dish-badge-bestseller"><i class="fa-solid fa-star"></i> BEST SELLER</div>' : ''}
          <div class="dish-cart-indicator ${inCartQty > 0 ? 'active' : ''}">${inCartQty}</div>
        </div>

        <div class="dish-details">
          <div>
            <div class="dish-category-tag">${escapeHtml(item.category || 'General')}</div>
            <div class="dish-name">${escapeHtml(item.name)}</div>
            <div class="dish-desc">${escapeHtml(item.desc || '')}</div>
          </div>

          <div class="dish-footer-row">
            <div class="dish-price">
              <span class="currency">₱</span>${parseFloat(item.price).toFixed(2)}
            </div>

            <div class="dish-actions">
              ${isManage ? `
                <button class="btn-card-action edit-btn" title="Edit Item & Price" data-edit-id="${item.id}">
                  <i class="fa-solid fa-pencil"></i>
                </button>
                <button class="btn-card-action del-btn" title="Remove Item" data-del-id="${item.id}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              ` : `
                <button class="btn-quick-add" title="Add to Order" data-add-id="${item.id}">
                  <i class="fa-solid fa-plus"></i>
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach card click handlers
  grid.querySelectorAll('.dish-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.edit-btn');
      const delBtn = e.target.closest('.del-btn');
      const id = card.dataset.id;

      if (editBtn) {
        e.stopPropagation();
        openEditItemModal(id);
      } else if (delBtn) {
        e.stopPropagation();
        confirmDeleteItem(id);
      } else {
        // Normal card click adds item to cart
        addToCart(id);
      }
    });
  });
}

// ============================================================================
// CART & ORDER MANAGEMENT
// ============================================================================
// Update single dish card badge without refreshing the catalog DOM
function updateItemBadge(itemId) {
  const card = document.querySelector(`.dish-card[data-id="${itemId}"]`);
  if (!card) return;
  const badge = card.querySelector('.dish-cart-indicator');
  if (!badge) return;
  const cartItem = state.cart.find(c => c.item.id === itemId);
  const inCartQty = cartItem ? cartItem.qty : 0;
  badge.textContent = inCartQty;
  if (inCartQty > 0) {
    badge.classList.add('active');
  } else {
    badge.classList.remove('active');
  }
}

function clearAllItemBadges() {
  document.querySelectorAll('.dish-cart-indicator').forEach(badge => {
    badge.textContent = '0';
    badge.classList.remove('active');
  });
}

function addToCart(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;

  AudioEngine.playTap();

  const existing = state.cart.find(c => c.item.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    state.cart.push({
      item: { ...item },
      qty: 1,
      note: ''
    });
  }

  updateItemBadge(itemId);
  renderCart();
}

function updateCartQty(itemId, delta) {
  const index = state.cart.findIndex(c => c.item.id === itemId);
  if (index === -1) return;

  AudioEngine.playTap();
  state.cart[index].qty += delta;

  if (state.cart[index].qty <= 0) {
    state.cart.splice(index, 1);
    AudioEngine.playDelete();
  }

  updateItemBadge(itemId);
  renderCart();
}

function removeCartItem(itemId) {
  const index = state.cart.findIndex(c => c.item.id === itemId);
  if (index === -1) return;

  AudioEngine.playDelete();
  state.cart.splice(index, 1);

  updateItemBadge(itemId);
  renderCart();
}

function clearCart() {
  if (state.cart.length === 0) return;
  if (confirm('Are you sure you want to clear the entire order?')) {
    AudioEngine.playDelete();
    state.cart = [];
    clearAllItemBadges();
    renderCart();
  }
}

function calculateCartTotals() {
  const subtotal = state.cart.reduce((sum, line) => sum + (line.item.price * line.qty), 0);
  const discountAmount = (subtotal * (state.discountPercent / 100));
  const grandTotal = Math.max(0, subtotal - discountAmount);

  return { subtotal, discountAmount, grandTotal };
}

function renderCart() {
  const list = document.getElementById('cart-items-list');
  const emptyView = document.getElementById('empty-cart-view');
  const cartCountBadge = document.getElementById('cart-items-count');
  const mobileCartBadge = document.getElementById('mobile-cart-badge');
  const subtotalDisplay = document.getElementById('cart-subtotal-val');
  const discountDisplay = document.getElementById('cart-discount-val');
  const totalDisplay = document.getElementById('cart-total-val');
  const checkoutBtn = document.getElementById('btn-checkout');

  const totalItemCount = state.cart.reduce((sum, line) => sum + line.qty, 0);
  if (cartCountBadge) cartCountBadge.textContent = totalItemCount;
  if (mobileCartBadge) mobileCartBadge.textContent = totalItemCount;

  const { subtotal, discountAmount, grandTotal } = calculateCartTotals();

  if (subtotalDisplay) subtotalDisplay.textContent = formatCurrency(subtotal);
  if (discountDisplay) discountDisplay.textContent = `-${formatCurrency(discountAmount)}`;
  if (totalDisplay) totalDisplay.textContent = formatCurrency(grandTotal);

  if (checkoutBtn) {
    checkoutBtn.disabled = state.cart.length === 0;
    checkoutBtn.innerHTML = `
      <i class="fa-solid fa-cash-register"></i>
      <span>Charge ${formatCurrency(grandTotal)}</span>
    `;
  }

  if (state.cart.length === 0) {
    if (list) list.innerHTML = '';
    if (emptyView) emptyView.style.display = 'flex';
    return;
  }

  if (emptyView) emptyView.style.display = 'none';

  if (list) {
    list.innerHTML = state.cart.map(line => {
      const lineTotal = line.item.price * line.qty;
      return `
        <div class="cart-item-card" data-id="${line.item.id}">
          <div class="cart-item-main">
            <div class="cart-item-left">
              <img src="${line.item.img || 'assets/logo.png'}" class="cart-item-thumb" onerror="this.src='assets/logo.png'">
              <div class="cart-item-info">
                <div class="cart-item-name">${escapeHtml(line.item.name)}</div>
                <div class="cart-item-unit-price">${formatCurrency(line.item.price)} each</div>
              </div>
            </div>
            <div class="cart-item-total">${formatCurrency(lineTotal)}</div>
          </div>

          ${line.note ? `<div class="cart-item-note-text"><i class="fa-solid fa-pen-nib"></i> Note: ${escapeHtml(line.note)}</div>` : ''}

          <div class="cart-item-bottom">
            <div class="cart-stepper">
              <button class="btn-step" data-step-id="${line.item.id}" data-delta="-1">&minus;</button>
              <span class="cart-qty-val">${line.qty}</span>
              <button class="btn-step" data-step-id="${line.item.id}" data-delta="1">&plus;</button>
            </div>

            <div class="cart-item-extras">
              <button class="btn-cart-note ${line.note ? 'has-note' : ''}" data-note-id="${line.item.id}" title="Add Custom Instruction">
                <i class="fa-solid fa-note-sticky"></i>
                <span>${line.note ? 'Edit Note' : 'Note'}</span>
              </button>
              <button class="btn-cart-remove" data-remove-id="${line.item.id}" title="Remove Item">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach cart item listeners
    list.querySelectorAll('.btn-step').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.stepId;
        const delta = parseInt(btn.dataset.delta, 10);
        updateCartQty(id, delta);
      });
    });

    list.querySelectorAll('.btn-cart-note').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCartNoteModal(btn.dataset.noteId);
      });
    });

    list.querySelectorAll('.btn-cart-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeCartItem(btn.dataset.removeId);
      });
    });
  }
}

// ============================================================================
// CATEGORY CRUD & MANAGEMENT
// ============================================================================
function populateCategorySelectDropdown(selectedCategory = '') {
  const select = document.getElementById('item-category-input');
  if (!select) return;

  const categories = getRawCategoriesList();
  if (categories.length === 0) {
    categories.push('Main Bowls');
  }

  // If selectedCategory is provided and not in the list, include it
  if (selectedCategory && !categories.includes(selectedCategory)) {
    categories.unshift(selectedCategory);
  }

  let html = categories.map(cat => `
    <option value="${escapeHtml(cat)}"${cat === selectedCategory ? ' selected' : ''}>${escapeHtml(cat)}</option>
  `).join('');

  html += `<option value="__NEW_CATEGORY__">➕ Add New Category...</option>`;

  select.innerHTML = html;
  if (selectedCategory) {
    select.value = selectedCategory;
  }
}

function openCategoriesModal() {
  renderCategoriesManageList();
  const input = document.getElementById('new-category-input');
  if (input) input.value = '';
  document.getElementById('modal-categories')?.classList.add('active');
  input?.focus();
}

function closeCategoriesModal() {
  document.getElementById('modal-categories')?.classList.remove('active');
  const itemModal = document.getElementById('modal-item');
  if (itemModal && itemModal.classList.contains('active')) {
    const currentSelected = document.getElementById('item-category-input')?.value;
    populateCategorySelectDropdown(currentSelected);
  }
}

function renderCategoriesManageList() {
  const container = document.getElementById('category-manage-list');
  if (!container) return;

  const categories = getRawCategoriesList();
  if (categories.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px; font-size: 0.85rem;">No custom categories created yet.</div>`;
    return;
  }

  container.innerHTML = categories.map(cat => {
    const count = state.catalog.filter(i => i.category === cat).length;
    return `
      <div class="category-manage-row" data-cat="${escapeHtml(cat)}">
        <div class="cat-row-info">
          <i class="fa-solid fa-folder-closed" style="color: var(--accent-gold); font-size: 0.85rem;"></i>
          <span class="cat-name-label">${escapeHtml(cat)}</span>
          <span class="cat-count-badge">${count} ${count === 1 ? 'dish' : 'dishes'}</span>
        </div>
        <div class="cat-row-actions">
          <button type="button" class="btn-cat-action edit" onclick="promptEditCategory('${escapeHtml(cat)}')" title="Rename Category">
            <i class="fa-solid fa-pencil"></i> Rename
          </button>
          <button type="button" class="btn-cat-action delete" onclick="confirmDeleteCategory('${escapeHtml(cat)}')" title="Delete Category">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function addNewCategory(name) {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    alert('Please enter a category name.');
    return null;
  }

  const existing = getRawCategoriesList();
  const match = existing.find(c => c.toLowerCase() === trimmed.toLowerCase());
  if (match) {
    showToast(`Category "${match}" already exists!`, 'fa-info-circle');
    return match;
  }

  if (!state.customCategories.includes(trimmed)) {
    state.customCategories.push(trimmed);
    state.saveCategories();
  }

  renderCategoriesBar();
  renderCategoriesManageList();

  const itemModal = document.getElementById('modal-item');
  if (itemModal && itemModal.classList.contains('active')) {
    populateCategorySelectDropdown(trimmed);
  }

  showToast(`Category "${trimmed}" added!`, 'fa-check');
  return trimmed;
}

window.promptEditCategory = function(oldName) {
  const newName = prompt(`Rename Category "${oldName}" to:`, oldName);
  if (newName === null) return; // Cancelled
  const trimmed = newName.trim();
  if (!trimmed) {
    alert('Category name cannot be empty.');
    return;
  }
  if (trimmed === oldName) return;

  const existing = getRawCategoriesList();
  if (existing.some(c => c.toLowerCase() === trimmed.toLowerCase() && c.toLowerCase() !== oldName.toLowerCase())) {
    alert(`A category named "${trimmed}" already exists.`);
    return;
  }

  // Update customCategories
  const idx = state.customCategories.indexOf(oldName);
  if (idx !== -1) {
    state.customCategories[idx] = trimmed;
  } else {
    state.customCategories.push(trimmed);
  }

  // Cascade: update all items in catalog with old category
  let updatedItemsCount = 0;
  state.catalog.forEach(item => {
    if (item.category === oldName) {
      item.category = trimmed;
      updatedItemsCount++;
    }
  });

  // If active filter was the old name, update it
  if (state.activeCategory === oldName) {
    state.activeCategory = trimmed;
  }

  state.saveCategories();
  state.saveCatalog();

  renderCategoriesBar();
  renderCatalog();
  renderCategoriesManageList();

  const itemModal = document.getElementById('modal-item');
  if (itemModal && itemModal.classList.contains('active')) {
    populateCategorySelectDropdown(trimmed);
  }

  showToast(`Renamed "${oldName}" to "${trimmed}" (${updatedItemsCount} dishes updated)`, 'fa-check');
};

window.confirmDeleteCategory = function(catName) {
  const itemsInCat = state.catalog.filter(i => i.category === catName);
  let confirmMsg = `Are you sure you want to delete category "${catName}"?`;
  if (itemsInCat.length > 0) {
    confirmMsg += `\n\n${itemsInCat.length} dish(es) in this category will be safely moved to "General".`;
  }

  if (!confirm(confirmMsg)) return;

  AudioEngine.playDelete();

  // Remove from customCategories
  state.customCategories = state.customCategories.filter(c => c !== catName);
  if (itemsInCat.length > 0) {
    if (!state.customCategories.includes('General')) {
      state.customCategories.push('General');
    }
    state.catalog.forEach(item => {
      if (item.category === catName) {
        item.category = 'General';
      }
    });
  }

  if (state.activeCategory === catName) {
    state.activeCategory = 'All';
  }

  state.saveCategories();
  state.saveCatalog();

  renderCategoriesBar();
  renderCatalog();
  renderCategoriesManageList();

  const itemModal = document.getElementById('modal-item');
  if (itemModal && itemModal.classList.contains('active')) {
    const currentSelected = document.getElementById('item-category-input').value;
    populateCategorySelectDropdown(currentSelected === catName ? 'General' : currentSelected);
  }

  showToast(`Category "${catName}" deleted`, 'fa-trash');
};

function quickAddCategoryPrompt() {
  const name = prompt('Enter new category name (e.g. Set Meals, Ramen, Appetizers):');
  if (!name) return;
  const created = addNewCategory(name);
  if (created) {
    populateCategorySelectDropdown(created);
  }
}

// ============================================================================
// ADD / EDIT / DELETE MENU ITEMS
// ============================================================================
function openAddItemModal() {
  document.getElementById('modal-item-title').innerHTML = `
    <i class="fa-solid fa-circle-plus" style="color: var(--primary-red);"></i>
    Add New Menu Item
  `;
  document.getElementById('edit-item-id').value = '';
  document.getElementById('item-name-input').value = '';
  document.getElementById('item-price-input').value = '';
  
  const defaultCat = (state.activeCategory && state.activeCategory !== 'All') ? state.activeCategory : 'Main Bowls';
  populateCategorySelectDropdown(defaultCat);

  document.getElementById('item-desc-input').value = '';
  document.getElementById('item-img-url').value = 'assets/torikatsu_curry.jpg';
  document.getElementById('item-bestseller-input').checked = false;

  highlightPresetImage('assets/torikatsu_curry.jpg');
  document.getElementById('modal-item').classList.add('active');
}

function openEditItemModal(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById('modal-item-title').innerHTML = `
    <i class="fa-solid fa-pen-to-square" style="color: var(--accent-gold);"></i>
    Edit Item & Category
  `;
  document.getElementById('edit-item-id').value = item.id;
  document.getElementById('item-name-input').value = item.name;
  document.getElementById('item-price-input').value = item.price;
  
  populateCategorySelectDropdown(item.category || 'Main Bowls');

  document.getElementById('item-desc-input').value = item.desc || '';
  document.getElementById('item-img-url').value = item.img || '';
  document.getElementById('item-bestseller-input').checked = !!item.bestSeller;

  highlightPresetImage(item.img || '');
  document.getElementById('modal-item').classList.add('active');
}

function highlightPresetImage(src) {
  document.querySelectorAll('#image-presets-container .image-choice-thumb').forEach(thumb => {
    if (thumb.dataset.src === src) {
      thumb.classList.add('selected');
    } else {
      thumb.classList.remove('selected');
    }
  });
}

function saveItemFromModal() {
  const id = document.getElementById('edit-item-id').value;
  const name = document.getElementById('item-name-input').value.trim();
  const price = parseFloat(document.getElementById('item-price-input').value);
  let category = document.getElementById('item-category-input').value;
  const desc = document.getElementById('item-desc-input').value.trim();
  const img = document.getElementById('item-img-url').value.trim() || 'assets/logo.png';
  const bestSeller = document.getElementById('item-bestseller-input').checked;

  if (!name) {
    alert('Please enter an item name.');
    return;
  }
  if (isNaN(price) || price < 0) {
    alert('Please enter a valid price (₱).');
    return;
  }
  if (!category || category === '__NEW_CATEGORY__') {
    category = 'General';
  }

  // Ensure category is in customCategories
  if (!state.customCategories.includes(category)) {
    state.customCategories.push(category);
    state.saveCategories();
  }

  if (id) {
    // Edit existing item
    const index = state.catalog.findIndex(i => i.id === id);
    if (index !== -1) {
      state.catalog[index] = {
        ...state.catalog[index],
        name,
        price,
        category,
        desc,
        img,
        bestSeller
      };
      // Also update any instance in the active cart
      state.cart.forEach(c => {
        if (c.item.id === id) {
          c.item.name = name;
          c.item.price = price;
          c.item.category = category;
          c.item.img = img;
        }
      });
    }
    showToast(`"${name}" updated!`, 'fa-check');
  } else {
    // Create new item
    const newItem = {
      id: 'custom-' + Date.now(),
      name,
      price,
      category,
      desc,
      img,
      bestSeller
    };
    state.catalog.unshift(newItem);
    showToast(`"${name}" added to ${category}!`, 'fa-plus-circle');
  }

  state.saveCatalog();
  renderCategoriesBar();
  renderCatalog();
  renderCart();
  closeModals();
}

function confirmDeleteItem(itemId) {
  const item = state.catalog.find(i => i.id === itemId);
  if (!item) return;

  if (confirm(`Are you sure you want to remove "${item.name}" from Yamato Shokudo menu?`)) {
    AudioEngine.playDelete();
    state.catalog = state.catalog.filter(i => i.id !== itemId);
    state.cart = state.cart.filter(c => c.item.id !== itemId);
    state.saveCatalog();

    // Remove specific card directly from DOM without full page flicker
    const card = document.querySelector(`.dish-card[data-id="${itemId}"]`);
    if (card) card.remove();

    renderCategoriesBar();
    renderCart();
    showToast(`"${item.name}" removed from menu`, 'fa-trash');
  }
}

// ============================================================================
// CART ITEM NOTE MODAL
// ============================================================================
function openCartNoteModal(itemId) {
  const cartItem = state.cart.find(c => c.item.id === itemId);
  if (!cartItem) return;

  state.selectedItemForNote = itemId;
  document.getElementById('note-modal-item-name').textContent = cartItem.item.name;
  document.getElementById('cart-item-note-input').value = cartItem.note || '';
  document.getElementById('modal-cart-note').classList.add('active');
}

function saveCartNote() {
  if (!state.selectedItemForNote) return;
  const cartItem = state.cart.find(c => c.item.id === state.selectedItemForNote);
  if (cartItem) {
    cartItem.note = document.getElementById('cart-item-note-input').value.trim();
    renderCart();
    showToast('Note updated');
  }
  closeModals();
}

// ============================================================================
// PAYMENT & CHECKOUT PROCESSING
// ============================================================================
function openPaymentModal() {
  const { grandTotal } = calculateCartTotals();
  if (grandTotal <= 0 && state.cart.length === 0) return;

  document.getElementById('payment-due-val').textContent = formatCurrency(grandTotal);
  
  const cashInput = document.getElementById('cash-received-input');
  cashInput.value = grandTotal.toFixed(0);
  state.activePaymentMethod = 'Cash';

  updatePaymentTabsUI();
  calculatePaymentChange();

  document.getElementById('modal-payment').classList.add('active');
  cashInput.focus();
}

function updatePaymentTabsUI() {
  document.querySelectorAll('#payment-method-tabs .payment-tab').forEach(tab => {
    if (tab.dataset.method === state.activePaymentMethod) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  const cashSection = document.getElementById('cash-payment-section');
  if (state.activePaymentMethod === 'Cash') {
    cashSection.style.display = 'flex';
  } else {
    cashSection.style.display = 'none';
  }
}

function calculatePaymentChange() {
  const { grandTotal } = calculateCartTotals();
  const cashReceived = parseFloat(document.getElementById('cash-received-input').value) || 0;
  const change = Math.max(0, cashReceived - grandTotal);
  
  const changeDisplay = document.getElementById('payment-change-val');
  changeDisplay.textContent = formatCurrency(change);

  if (cashReceived < grandTotal && state.activePaymentMethod === 'Cash') {
    changeDisplay.style.color = 'var(--primary-red)';
    changeDisplay.textContent = 'Insufficient';
  } else {
    changeDisplay.style.color = 'var(--accent-green)';
  }
}

function processPaymentSubmission() {
  const { subtotal, discountAmount, grandTotal } = calculateCartTotals();
  let cashReceived = grandTotal;
  let change = 0;

  if (state.activePaymentMethod === 'Cash') {
    cashReceived = parseFloat(document.getElementById('cash-received-input').value) || 0;
    if (cashReceived < grandTotal) {
      alert(`Amount tendered (₱${cashReceived}) is less than total due (₱${grandTotal.toFixed(2)}).`);
      return;
    }
    change = cashReceived - grandTotal;
  }

  // Create Order Record
  const orderNumber = state.nextOrderNumber();
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const orderRecord = {
    id: 'ord-' + Date.now(),
    orderNumber,
    date: dateStr,
    time: timeStr,
    timestamp: now.getTime(),
    status: 'Pending',
    diningType: state.orderType,
    tableNum: state.tableNum || 'Counter',
    items: JSON.parse(JSON.stringify(state.cart)),
    subtotal,
    discountPercent: state.discountPercent,
    discountAmount,
    total: grandTotal,
    paymentMethod: state.activePaymentMethod,
    cashReceived,
    change
  };

  // Save to sales log
  state.salesHistory.unshift(orderRecord);
  state.saveSalesHistory();
  updateActiveOrdersBadge();

  // Play Register Chime
  AudioEngine.playChime();

  // Close payment modal and open receipt modal
  closeModals();
  renderReceiptModal(orderRecord);

  // Clear current cart
  state.cart = [];
  renderCart();
  renderCatalog();
  showToast(`Order ${orderNumber} placed (${formatCurrency(grandTotal)})!`, 'fa-circle-check');
}

// ============================================================================
// CURRENT / ACTIVE ORDERS QUEUE MANAGEMENT
// ============================================================================
function updateActiveOrdersBadge() {
  const pendingOrders = state.salesHistory.filter(o => o.status === 'Pending');
  const badge = document.getElementById('active-orders-count-badge');
  const modalBadge = document.getElementById('active-orders-modal-badge');
  const countFilterActive = document.getElementById('count-filter-active');
  const countFilterCompleted = document.getElementById('count-filter-completed');
  const countFilterCancelled = document.getElementById('count-filter-cancelled');

  const pendingCount = pendingOrders.length;
  const completedCount = state.salesHistory.filter(o => o.status === 'Completed').length;
  const cancelledCount = state.salesHistory.filter(o => o.status === 'Cancelled').length;

  if (badge) {
    badge.textContent = pendingCount.toString();
    if (pendingCount > 0) {
      badge.style.removeProperty('display');
      badge.classList.remove('hidden-badge');
    } else {
      badge.style.display = 'none';
      badge.classList.add('hidden-badge');
    }
  }
  if (modalBadge) {
    modalBadge.textContent = `${pendingCount} Active`;
  }
  if (countFilterActive) countFilterActive.textContent = pendingCount.toString();
  if (countFilterCompleted) countFilterCompleted.textContent = completedCount.toString();
  if (countFilterCancelled) countFilterCancelled.textContent = cancelledCount.toString();
}

function openOrdersModal(filter = 'Pending') {
  AudioEngine.playTap();
  state.ordersFilter = filter;
  updateOrdersFilterUI();
  renderOrdersQueue();
  document.getElementById('modal-orders')?.classList.add('active');
}

function updateOrdersFilterUI() {
  document.querySelectorAll('.orders-filter-row .btn-tag-action').forEach(btn => {
    if (btn.dataset.filter === state.ordersFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function renderOrdersQueue() {
  updateActiveOrdersBadge();
  const container = document.getElementById('active-orders-container');
  const emptyView = document.getElementById('empty-orders-view');
  const emptyTitle = document.getElementById('empty-orders-title');
  const emptyDesc = document.getElementById('empty-orders-desc');
  if (!container) return;

  let orders = state.salesHistory;
  if (state.ordersFilter) {
    orders = orders.filter(o => o.status === state.ordersFilter);
  }

  if (orders.length === 0) {
    container.innerHTML = '';
    if (emptyView) {
      emptyView.style.display = 'flex';
      if (state.ordersFilter === 'Pending') {
        emptyTitle.textContent = 'No Active Orders';
        emptyDesc.textContent = 'All caught up! New orders placed at checkout will appear here for preparation and serving.';
      } else if (state.ordersFilter === 'Completed') {
        emptyTitle.textContent = 'No Completed Orders';
        emptyDesc.textContent = 'Completed orders will be listed here.';
      } else {
        emptyTitle.textContent = 'No Cancelled Orders';
        emptyDesc.textContent = 'Cancelled or voided orders will be listed here.';
      }
    }
    return;
  }

  if (emptyView) emptyView.style.display = 'none';

  container.innerHTML = orders.map(ord => {
    const isPending = ord.status === 'Pending';
    const isCancelled = ord.status === 'Cancelled';
    const isCompleted = ord.status === 'Completed';

    const statusClass = isPending ? 'status-pending' : (isCompleted ? 'status-completed' : 'status-cancelled');
    const statusLabel = ord.status || 'Completed';

    return `
      <div class="order-queue-card ${statusClass}" data-order-id="${ord.id}">
        <div class="order-queue-header">
          <div class="order-queue-meta">
            <span class="order-queue-number">${ord.orderNumber}</span>
            <span class="order-queue-type">
              <i class="fa-solid fa-utensils"></i> ${escapeHtml(ord.diningType)} (${escapeHtml(ord.tableNum || 'Counter')})
            </span>
          </div>
          <div class="order-queue-status">
            <span class="order-time-tag"><i class="fa-regular fa-clock"></i> ${ord.time}</span>
            <span class="order-status-pill ${statusClass}">${statusLabel}</span>
          </div>
        </div>

        <div class="order-queue-items">
          ${ord.items.map(line => `
            <div class="order-queue-item-row">
              <span class="item-qty">${line.qty}x</span>
              <span class="item-name">${escapeHtml(line.item.name)}</span>
              ${line.note ? `<span class="item-note">(${escapeHtml(line.note)})</span>` : ''}
              <span class="item-price">${formatCurrency(line.item.price * line.qty)}</span>
            </div>
          `).join('')}
        </div>

        <div class="order-queue-footer">
          <div class="order-queue-total">
            <span>Total: <strong>${formatCurrency(ord.total)}</strong> <small>(${ord.paymentMethod})</small></span>
          </div>

          <div class="order-queue-actions">
            ${isPending ? `
              <button class="btn-order-action cancel" onclick="cancelOrder('${ord.id}')" title="Cancel order and subtract from sales">
                <i class="fa-solid fa-xmark"></i> Cancel
              </button>
              <button class="btn-order-action complete" onclick="completeOrder('${ord.id}')" title="Mark order as completed">
                <i class="fa-solid fa-check"></i> Complete
              </button>
            ` : `
              <button class="btn-order-action view" onclick="reprintOrder('${ord.id}')" title="View / Print Receipt">
                <i class="fa-solid fa-receipt"></i> Receipt
              </button>
            `}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.completeOrder = function(orderId) {
  const order = state.salesHistory.find(o => o.id === orderId);
  if (!order) return;

  AudioEngine.playTap();
  order.status = 'Completed';
  state.saveSalesHistory();

  showToast(`Order ${order.orderNumber} Completed!`, 'fa-circle-check');
  updateActiveOrdersBadge();
  renderOrdersQueue();
  renderSalesHistory();
};

window.cancelOrder = function(orderId) {
  const order = state.salesHistory.find(o => o.id === orderId);
  if (!order) return;

  const confirmMsg = `Are you sure you want to CANCEL Order ${order.orderNumber}?\n\n` +
    `Total amount of ${formatCurrency(order.total)} will be subtracted from today's sales.`;

  if (!confirm(confirmMsg)) return;

  AudioEngine.playDelete();
  order.status = 'Cancelled';
  state.saveSalesHistory();

  showToast(`Order ${order.orderNumber} Cancelled (-${formatCurrency(order.total)})`, 'fa-ban');
  updateActiveOrdersBadge();
  renderOrdersQueue();
  renderSalesHistory();
};

// ============================================================================
// THERMAL RECEIPT RENDERING & PRINTING
// ============================================================================
function renderReceiptModal(order) {
  document.getElementById('receipt-order-id').textContent = `Order ${order.orderNumber}`;
  document.getElementById('receipt-date-time').textContent = `${order.date} ${order.time}`;
  document.getElementById('receipt-dining-type').textContent = `${order.diningType.toUpperCase()} (${order.tableNum})`;
  document.getElementById('receipt-pay-method').textContent = order.paymentMethod.toUpperCase();

  const tbody = document.getElementById('receipt-items-body');
  tbody.innerHTML = order.items.map(line => {
    const lineTotal = line.item.price * line.qty;
    return `
      <tr>
        <td class="item-qty-col">${line.qty}x</td>
        <td>
          ${escapeHtml(line.item.name)}
          ${line.note ? `<br><small style="color:#555;">- ${escapeHtml(line.note)}</small>` : ''}
        </td>
        <td class="item-amt-col">${formatCurrency(lineTotal)}</td>
      </tr>
    `;
  }).join('');

  document.getElementById('receipt-subtotal-val').textContent = formatCurrency(order.subtotal);
  
  const discountRow = document.getElementById('receipt-discount-row');
  if (order.discountAmount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('receipt-discount-val').textContent = `-${formatCurrency(order.discountAmount)} (${order.discountPercent}%)`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('receipt-total-val').textContent = formatCurrency(order.total);
  document.getElementById('receipt-tendered-val').textContent = formatCurrency(order.cashReceived);
  document.getElementById('receipt-change-val').textContent = formatCurrency(order.change);

  document.getElementById('modal-receipt').classList.add('active');
}

// ============================================================================
// SALES DASHBOARD & INTERACTIVE DATE RANGE CALENDAR
// ============================================================================
const CAL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function getIsoDateString(d) {
  if (!d) return '';
  const dateObj = (d instanceof Date) ? d : new Date(d);
  if (isNaN(dateObj.getTime())) return '';
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(isoStr) {
  if (!isoStr) return '--';
  const parts = isoStr.split('-');
  if (parts.length !== 3) return isoStr;
  const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
}

function getOrderIsoDate(order) {
  if (order.timestamp) {
    return getIsoDateString(new Date(order.timestamp));
  }
  if (order.date) {
    const parsed = new Date(order.date);
    if (!isNaN(parsed.getTime())) {
      return getIsoDateString(parsed);
    }
  }
  return '';
}

function setSalesDatePreset(presetKey) {
  state.salesFilterPreset = presetKey;
  const today = new Date();
  
  if (presetKey === 'today') {
    const todayIso = getIsoDateString(today);
    state.salesStartDate = todayIso;
    state.salesEndDate = todayIso;
  } else if (presetKey === 'yesterday') {
    const yest = new Date(today);
    yest.setDate(yest.getDate() - 1);
    const yestIso = getIsoDateString(yest);
    state.salesStartDate = yestIso;
    state.salesEndDate = yestIso;
  } else if (presetKey === '7days') {
    const past = new Date(today);
    past.setDate(past.getDate() - 6);
    state.salesStartDate = getIsoDateString(past);
    state.salesEndDate = getIsoDateString(today);
  } else if (presetKey === 'month') {
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    state.salesStartDate = getIsoDateString(firstDay);
    state.salesEndDate = getIsoDateString(lastDay);
  } else if (presetKey === 'all') {
    state.salesStartDate = null;
    state.salesEndDate = null;
  }

  closeCalendarPopup();
  updateSalesDateUI();
  renderSalesHistory();
}

function updateSalesDateUI() {
  // Update Preset Buttons Active Class
  document.querySelectorAll('.sales-date-presets-row [data-range-preset]').forEach(btn => {
    if (btn.dataset.rangePreset === state.salesFilterPreset) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Start & End Date Inputs Display
  const startValEl = document.getElementById('sales-start-date-val');
  const endValEl = document.getElementById('sales-end-date-val');
  const rangeBadge = document.getElementById('sales-history-range-badge');
  const salesLabel = document.getElementById('analytics-sales-label');

  if (startValEl) {
    startValEl.textContent = state.salesStartDate ? formatDisplayDate(state.salesStartDate) : 'Start date';
  }
  if (endValEl) {
    endValEl.textContent = state.salesEndDate ? formatDisplayDate(state.salesEndDate) : 'End date';
  }

  // Update Range Badge & Revenue Label
  let labelText = "Today's Revenue";
  let badgeText = "Today";

  if (state.salesFilterPreset === 'today') {
    labelText = "Today's Revenue";
    badgeText = "Today";
  } else if (state.salesFilterPreset === 'yesterday') {
    labelText = "Yesterday's Revenue";
    badgeText = "Yesterday";
  } else if (state.salesFilterPreset === '7days') {
    labelText = "Last 7 Days Revenue";
    badgeText = "Last 7 Days";
  } else if (state.salesFilterPreset === 'month') {
    labelText = "This Month's Revenue";
    badgeText = "This Month";
  } else if (state.salesFilterPreset === 'all') {
    labelText = "All Time Revenue";
    badgeText = "All Time";
  } else if (state.salesStartDate && state.salesEndDate) {
    if (state.salesStartDate === state.salesEndDate) {
      labelText = `${formatDisplayDate(state.salesStartDate)} Revenue`;
      badgeText = formatDisplayDate(state.salesStartDate);
    } else {
      labelText = `Range Revenue (${formatDisplayDate(state.salesStartDate)} - ${formatDisplayDate(state.salesEndDate)})`;
      badgeText = `${formatDisplayDate(state.salesStartDate)} - ${formatDisplayDate(state.salesEndDate)}`;
    }
  }

  if (salesLabel) salesLabel.textContent = labelText;
  if (rangeBadge) rangeBadge.textContent = badgeText;
}

function openCalendarPopup(targetInput = 'start') {
  const popup = document.getElementById('sales-calendar-popup');
  if (!popup) return;

  state.calPickingPhase = targetInput === 'end' && state.calDraftStart ? 'end' : 'start';
  state.calDraftStart = state.salesStartDate;
  state.calDraftEnd = state.salesEndDate;

  // Initialize view year & month to start date or today
  const refDate = state.salesStartDate ? new Date(state.salesStartDate) : new Date();
  state.calViewYear = refDate.getFullYear();
  state.calViewMonth = refDate.getMonth();

  renderCalendarPopup();
  popup.style.display = 'flex';

  document.getElementById('sales-start-date-btn')?.classList.toggle('active', targetInput === 'start');
  document.getElementById('sales-end-date-btn')?.classList.toggle('active', targetInput === 'end');
}

function closeCalendarPopup() {
  const popup = document.getElementById('sales-calendar-popup');
  if (popup) popup.style.display = 'none';
  document.getElementById('sales-start-date-btn')?.classList.remove('active');
  document.getElementById('sales-end-date-btn')?.classList.remove('active');
}

function renderCalendarPopup() {
  const titleEl = document.getElementById('cal-month-title');
  const daysGrid = document.getElementById('cal-days-grid');
  const previewEl = document.getElementById('cal-selected-preview');
  if (!titleEl || !daysGrid) return;

  const year = state.calViewYear;
  const month = state.calViewMonth;

  titleEl.textContent = `${CAL_MONTH_NAMES[month]} ${year}`;

  const todayIso = getIsoDateString(new Date());
  const draftStart = state.calDraftStart;
  const draftEnd = state.calDraftEnd;

  // Update preview text in popup footer
  if (previewEl) {
    if (draftStart && draftEnd) {
      if (draftStart === draftEnd) {
        previewEl.textContent = `Selected: ${formatDisplayDate(draftStart)}`;
      } else {
        previewEl.textContent = `${formatDisplayDate(draftStart)} - ${formatDisplayDate(draftEnd)}`;
      }
    } else if (draftStart) {
      previewEl.textContent = `Start: ${formatDisplayDate(draftStart)} (Select End Date)`;
    } else {
      previewEl.textContent = 'Select start & end date';
    }
  }

  // Calculate calendar dates: Monday is column 0, Sunday is column 6 (matching image)
  const firstDayOfMonth = new Date(year, month, 1);
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  let daysHtml = '';

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevDate = new Date(year, month - 1, dayNum);
    const iso = getIsoDateString(prevDate);
    daysHtml += `
      <div class="cal-day is-other-month" data-date="${iso}">
        <span class="cal-day-num">${dayNum}</span>
      </div>
    `;
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(year, month, d);
    const iso = getIsoDateString(curDate);
    const isToday = iso === todayIso;
    const isStart = iso === draftStart;
    const isEnd = iso === draftEnd;
    const isInRange = draftStart && draftEnd && iso > draftStart && iso < draftEnd;

    let classes = ['cal-day'];
    if (isToday) classes.push('is-today');
    if (isStart) classes.push('is-selected-start');
    if (isEnd) classes.push('is-selected-end');
    if (isInRange) classes.push('is-in-range');

    daysHtml += `
      <div class="${classes.join(' ')}" data-date="${iso}">
        <span class="cal-day-num">${d}</span>
      </div>
    `;
  }

  // Next month leading days
  const totalRendered = startDayOfWeek + daysInMonth;
  const nextDaysCount = (7 - (totalRendered % 7)) % 7;
  for (let n = 1; n <= nextDaysCount; n++) {
    const nextDate = new Date(year, month + 1, n);
    const iso = getIsoDateString(nextDate);
    daysHtml += `
      <div class="cal-day is-other-month" data-date="${iso}">
        <span class="cal-day-num">${n}</span>
      </div>
    `;
  }

  daysGrid.innerHTML = daysHtml;

  // Day cell click events
  daysGrid.querySelectorAll('.cal-day').forEach(cell => {
    cell.addEventListener('click', (e) => {
      e.stopPropagation();
      const selectedIso = cell.dataset.date;
      if (!selectedIso) return;

      if (state.calPickingPhase === 'start') {
        state.calDraftStart = selectedIso;
        state.calDraftEnd = null;
        state.calPickingPhase = 'end';
      } else {
        if (state.calDraftStart && selectedIso < state.calDraftStart) {
          state.calDraftEnd = state.calDraftStart;
          state.calDraftStart = selectedIso;
        } else {
          state.calDraftEnd = selectedIso;
        }
        state.calPickingPhase = 'start';
      }

      renderCalendarPopup();
    });
  });
}

function applyCustomCalendarRange() {
  if (!state.calDraftStart && !state.calDraftEnd) {
    setSalesDatePreset('all');
    closeCalendarPopup();
    return;
  }

  state.salesStartDate = state.calDraftStart || state.calDraftEnd;
  state.salesEndDate = state.calDraftEnd || state.calDraftStart;
  state.salesFilterPreset = 'custom';

  closeCalendarPopup();
  updateSalesDateUI();
  renderSalesHistory();
  showToast(`Filtered: ${formatDisplayDate(state.salesStartDate)} to ${formatDisplayDate(state.salesEndDate)}`);
}

function getFilteredSalesHistory() {
  const history = state.salesHistory;
  if (!state.salesStartDate && !state.salesEndDate) {
    return history;
  }

  const start = state.salesStartDate || '0000-00-00';
  const end = state.salesEndDate || '9999-99-99';

  return history.filter(ord => {
    const ordIso = getOrderIsoDate(ord);
    if (!ordIso) return true;
    return ordIso >= start && ordIso <= end;
  });
}

function renderSalesHistory() {
  updateSalesDateUI();

  const totalSalesVal = document.getElementById('analytics-total-sales');
  const totalOrdersVal = document.getElementById('analytics-total-orders');
  const avgTicketVal = document.getElementById('analytics-avg-ticket');
  const tableBody = document.getElementById('history-table-body');
  const emptyView = document.getElementById('empty-history-view');
  const recordsCountEl = document.getElementById('history-records-count');
  const tableEl = document.getElementById('sales-history-table');

  const filteredHistory = getFilteredSalesHistory();
  const activeSales = filteredHistory.filter(o => o.status !== 'Cancelled');
  const totalRevenue = activeSales.reduce((sum, ord) => sum + ord.total, 0);
  const totalOrders = activeSales.length;
  const avgTicket = totalOrders > 0 ? (totalRevenue / totalOrders) : 0;

  if (totalSalesVal) totalSalesVal.textContent = formatCurrency(totalRevenue);
  if (totalOrdersVal) totalOrdersVal.textContent = totalOrders.toString();
  if (avgTicketVal) avgTicketVal.textContent = formatCurrency(avgTicket);
  if (recordsCountEl) recordsCountEl.textContent = `${filteredHistory.length} transaction${filteredHistory.length === 1 ? '' : 's'}`;

  if (tableBody) {
    if (filteredHistory.length === 0) {
      tableBody.innerHTML = '';
      if (tableEl) tableEl.style.display = 'none';
      if (emptyView) emptyView.style.display = 'flex';
      return;
    }

    if (tableEl) tableEl.style.display = 'table';
    if (emptyView) emptyView.style.display = 'none';

    tableBody.innerHTML = filteredHistory.map(ord => {
      const isCancelled = ord.status === 'Cancelled';
      const isPending = ord.status === 'Pending';
      const statusClass = isCancelled ? 'status-cancelled' : (isPending ? 'status-pending' : 'status-completed');
      const statusLabel = ord.status || 'Completed';

      const amountHtml = isCancelled
        ? `<s style="opacity:0.5; color:var(--text-muted);">${formatCurrency(ord.total)}</s> <small style="color:var(--primary-red); font-weight:700;">(Void)</small>`
        : `<strong>${formatCurrency(ord.total)}</strong>`;

      return `
        <tr class="${isCancelled ? 'row-cancelled' : ''}">
          <td><strong style="color: var(--primary-red-light);">${ord.orderNumber}</strong></td>
          <td>${ord.date} ${ord.time}</td>
          <td>${escapeHtml(ord.diningType)} (${escapeHtml(ord.tableNum || 'Counter')})</td>
          <td>${escapeHtml(ord.paymentMethod)}</td>
          <td><span class="order-status-pill ${statusClass}">${statusLabel}</span></td>
          <td>${amountHtml}</td>
          <td>
            <button class="btn-history-view" onclick="reprintOrder('${ord.id}')" title="View / Print Receipt">
              <i class="fa-solid fa-receipt"></i> View
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
}

window.reprintOrder = function(orderId) {
  const order = state.salesHistory.find(o => o.id === orderId);
  if (order) {
    renderReceiptModal(order);
  }
};

function exportSalesToCSV() {
  const filteredHistory = getFilteredSalesHistory();
  if (filteredHistory.length === 0) {
    alert('No sales data in this date range to export.');
    return;
  }

  let csv = 'OrderNumber,Date,Time,DiningType,Table,PaymentMethod,Status,Subtotal,Discount,Total,CashReceived,Change,ItemsCount\n';
  filteredHistory.forEach(ord => {
    csv += `"${ord.orderNumber}","${ord.date}","${ord.time}","${ord.diningType}","${ord.tableNum}","${ord.paymentMethod}","${ord.status || 'Completed'}",${ord.subtotal},${ord.discountAmount},${ord.total},${ord.cashReceived},${ord.change},${ord.items.length}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const rangeName = state.salesFilterPreset === 'all' ? 'All_Time' : `${state.salesStartDate || 'Start'}_to_${state.salesEndDate || 'End'}`;
  a.download = `Yamato_Shokudo_Sales_${rangeName}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Filtered Sales CSV exported!');
}

function exportFullBackupJSON() {
  const data = {
    brand: 'Yamato Shokudo',
    version: '1.0',
    exportDate: new Date().toISOString(),
    categories: state.customCategories,
    catalog: state.catalog,
    salesHistory: state.salesHistory
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Yamato_Shokudo_Backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup JSON exported!');
}

function resetDefaultMenu() {
  if (confirm('Reset catalog back to the official Yamato Shokudo starting menu? All items, categories & prices will be restored.')) {
    state.customCategories = [...DEFAULT_CATEGORIES];
    state.saveCategories();
    state.catalog = [...DEFAULT_MENU];
    state.saveCatalog();
    state.activeCategory = 'All';
    renderCategoriesBar();
    renderCatalog();
    renderCart();
    showToast('Default menu restored!');
    closeModals();
  }
}

function clearSalesHistory() {
  if (confirm('Are you sure you want to clear all completed sales transaction logs?')) {
    state.salesHistory = [];
    state.saveSalesHistory();
    renderSalesHistory();
    showToast('Sales history reset', 'fa-trash');
  }
}

// ============================================================================
// MODAL MANAGEMENT & CLOSE
// ============================================================================
function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

// ============================================================================
// EVENT LISTENERS INITIALIZATION
// ============================================================================
function initEventListeners() {
  // Live Clock
  setInterval(() => {
    const clock = document.getElementById('pos-live-clock');
    if (clock) {
      const now = new Date();
      clock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }, 1000);

  // Search input
  const searchInput = document.getElementById('catalog-search');
  const clearSearchBtn = document.getElementById('btn-clear-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (clearSearchBtn) {
        if (state.searchQuery) clearSearchBtn.classList.add('visible');
        else clearSearchBtn.classList.remove('visible');
      }
      renderCatalog();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      state.searchQuery = '';
      clearSearchBtn.classList.remove('visible');
      renderCatalog();
      searchInput.focus();
    });
  }

  // Toggle Manage Mode (Edit / Delete buttons on cards)
  const toggleManageBtn = document.getElementById('btn-toggle-manage-mode');
  const manageLabel = document.getElementById('manage-mode-label');
  if (toggleManageBtn) {
    toggleManageBtn.addEventListener('click', () => {
      AudioEngine.playTap();
      state.manageMode = !state.manageMode;
      if (state.manageMode) {
        toggleManageBtn.classList.add('primary');
        if (manageLabel) manageLabel.textContent = 'Exit Edit';
        showToast('Edit Mode: Tap pencil to edit or trash to remove items', 'fa-pencil');
      } else {
        toggleManageBtn.classList.remove('primary');
        if (manageLabel) manageLabel.textContent = 'Edit Menu';
      }
      renderCatalog();
    });
  }

  // Add Item Modal triggers
  document.getElementById('btn-open-add-item')?.addEventListener('click', openAddItemModal);
  document.getElementById('btn-close-item-modal')?.addEventListener('click', closeModals);
  document.getElementById('btn-cancel-item')?.addEventListener('click', closeModals);
  document.getElementById('btn-save-item')?.addEventListener('click', saveItemFromModal);

  // Preset image selection in modal
  document.querySelectorAll('#image-presets-container .image-choice-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      document.getElementById('item-img-url').value = src;
      highlightPresetImage(src);
    });
  });

  // Local File Upload in Modal
  document.getElementById('item-file-upload')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('item-img-url').value = ev.target.result;
        highlightPresetImage('');
      };
      reader.readAsDataURL(file);
    }
  });

  // Category Controls in Add/Edit Item Modal
  document.getElementById('btn-quick-add-cat-from-item')?.addEventListener('click', quickAddCategoryPrompt);
  document.getElementById('btn-manage-cats-from-item')?.addEventListener('click', () => {
    openCategoriesModal();
  });
  document.getElementById('item-category-input')?.addEventListener('change', (e) => {
    if (e.target.value === '__NEW_CATEGORY__') {
      quickAddCategoryPrompt();
    }
  });

  // Manage Categories Modal Triggers
  document.getElementById('btn-close-categories-modal')?.addEventListener('click', closeCategoriesModal);
  document.getElementById('btn-close-categories-btn')?.addEventListener('click', closeCategoriesModal);
  
  const submitCatBtn = document.getElementById('btn-submit-new-category');
  const newCatInput = document.getElementById('new-category-input');
  if (submitCatBtn && newCatInput) {
    const handleAddCat = () => {
      if (newCatInput.value.trim()) {
        addNewCategory(newCatInput.value.trim());
        newCatInput.value = '';
        newCatInput.focus();
      }
    };
    submitCatBtn.addEventListener('click', handleAddCat);
    newCatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddCat();
      }
    });
  }

  // Cart Note Modal
  document.getElementById('btn-close-note-modal')?.addEventListener('click', closeModals);
  document.getElementById('btn-cancel-note')?.addEventListener('click', closeModals);
  document.getElementById('btn-save-note')?.addEventListener('click', saveCartNote);

  document.querySelectorAll('.quick-tag-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.tag;
      const input = document.getElementById('cart-item-note-input');
      if (input.value) input.value += ', ' + tag;
      else input.value = tag;
    });
  });

  // Order Type & Table
  document.getElementById('order-type-select')?.addEventListener('change', (e) => {
    state.orderType = e.target.value;
  });
  document.getElementById('order-table-input')?.addEventListener('input', (e) => {
    state.tableNum = e.target.value;
  });

  // Discount Select
  document.getElementById('discount-select')?.addEventListener('change', (e) => {
    state.discountPercent = parseFloat(e.target.value) || 0;
    renderCart();
  });

  // Clear Cart
  document.getElementById('btn-clear-cart')?.addEventListener('click', clearCart);

  // Checkout Button
  document.getElementById('btn-checkout')?.addEventListener('click', () => {
    AudioEngine.playTap();
    openPaymentModal();
  });

  // Payment Modal actions
  document.getElementById('btn-close-payment-modal')?.addEventListener('click', closeModals);
  document.getElementById('btn-cancel-payment')?.addEventListener('click', closeModals);
  document.getElementById('btn-confirm-payment')?.addEventListener('click', processPaymentSubmission);

  document.querySelectorAll('#payment-method-tabs .payment-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      AudioEngine.playTap();
      state.activePaymentMethod = tab.dataset.method;
      updatePaymentTabsUI();
      calculatePaymentChange();
    });
  });

  document.getElementById('cash-received-input')?.addEventListener('input', calculatePaymentChange);

  // Quick Cash Buttons
  document.getElementById('btn-cash-exact')?.addEventListener('click', () => {
    const { grandTotal } = calculateCartTotals();
    document.getElementById('cash-received-input').value = grandTotal.toFixed(0);
    calculatePaymentChange();
  });

  document.querySelectorAll('.btn-quick-cash[data-add]').forEach(btn => {
    btn.addEventListener('click', () => {
      const addVal = parseFloat(btn.dataset.add);
      const input = document.getElementById('cash-received-input');
      const current = parseFloat(input.value) || 0;
      input.value = (current + addVal).toFixed(0);
      calculatePaymentChange();
    });
  });

  // Receipt Modal actions
  document.getElementById('btn-close-receipt-modal')?.addEventListener('click', () => {
    document.getElementById('modal-receipt')?.classList.remove('active');
  });
  document.getElementById('btn-print-receipt')?.addEventListener('click', () => {
    window.print();
  });
  document.getElementById('btn-new-order-from-receipt')?.addEventListener('click', () => {
    closeModals();
  });
  document.getElementById('btn-view-orders-from-receipt')?.addEventListener('click', () => {
    closeModals();
    openOrdersModal('Pending');
  });

  // Current Orders Modal
  document.getElementById('btn-open-orders')?.addEventListener('click', () => {
    openOrdersModal('Pending');
  });
  document.getElementById('btn-close-orders-modal')?.addEventListener('click', closeModals);
  document.getElementById('btn-close-orders-btn')?.addEventListener('click', closeModals);
  document.getElementById('btn-open-history-from-orders')?.addEventListener('click', () => {
    closeModals();
    renderSalesHistory();
    document.getElementById('modal-history')?.classList.add('active');
  });

  // Orders Filter Tabs
  document.getElementById('filter-orders-active')?.addEventListener('click', () => {
    state.ordersFilter = 'Pending';
    updateOrdersFilterUI();
    renderOrdersQueue();
  });
  document.getElementById('filter-orders-completed')?.addEventListener('click', () => {
    state.ordersFilter = 'Completed';
    updateOrdersFilterUI();
    renderOrdersQueue();
  });
  document.getElementById('filter-orders-cancelled')?.addEventListener('click', () => {
    state.ordersFilter = 'Cancelled';
    updateOrdersFilterUI();
    renderOrdersQueue();
  });

  // Sales History Modal & Date Range Calendar Controls
  document.getElementById('btn-open-history')?.addEventListener('click', () => {
    AudioEngine.playTap();
    renderSalesHistory();
    document.getElementById('modal-history').classList.add('active');
  });
  document.getElementById('btn-close-history-modal')?.addEventListener('click', () => {
    closeCalendarPopup();
    closeModals();
  });
  document.getElementById('btn-close-history-btn')?.addEventListener('click', () => {
    closeCalendarPopup();
    closeModals();
  });
  document.getElementById('btn-export-sales-csv')?.addEventListener('click', exportSalesToCSV);
  document.getElementById('btn-reset-sales-history')?.addEventListener('click', clearSalesHistory);

  // Sales Date Filter Presets
  document.querySelectorAll('.sales-date-presets-row [data-range-preset]').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.playTap();
      setSalesDatePreset(btn.dataset.rangePreset);
    });
  });

  // Start / End Date Picker Input Buttons
  document.getElementById('sales-start-date-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioEngine.playTap();
    const popup = document.getElementById('sales-calendar-popup');
    if (popup && popup.style.display === 'flex' && state.calPickingPhase === 'start') {
      closeCalendarPopup();
    } else {
      openCalendarPopup('start');
    }
  });

  document.getElementById('sales-end-date-btn')?.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioEngine.playTap();
    const popup = document.getElementById('sales-calendar-popup');
    if (popup && popup.style.display === 'flex' && state.calPickingPhase === 'end') {
      closeCalendarPopup();
    } else {
      openCalendarPopup('end');
    }
  });

  document.getElementById('btn-reset-date-filter')?.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioEngine.playTap();
    setSalesDatePreset('all');
  });

  // Calendar Controls
  document.getElementById('cal-prev-month')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.calViewMonth--;
    if (state.calViewMonth < 0) {
      state.calViewMonth = 11;
      state.calViewYear--;
    }
    renderCalendarPopup();
  });

  document.getElementById('cal-next-month')?.addEventListener('click', (e) => {
    e.stopPropagation();
    state.calViewMonth++;
    if (state.calViewMonth > 11) {
      state.calViewMonth = 0;
      state.calViewYear++;
    }
    renderCalendarPopup();
  });

  document.getElementById('btn-cal-apply')?.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioEngine.playTap();
    applyCustomCalendarRange();
  });

  document.getElementById('btn-cal-cancel')?.addEventListener('click', (e) => {
    e.stopPropagation();
    closeCalendarPopup();
  });

  document.getElementById('sales-calendar-popup')?.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    const popup = document.getElementById('sales-calendar-popup');
    if (popup && popup.style.display === 'flex') {
      if (!e.target.closest('#sales-calendar-popup') && !e.target.closest('#sales-start-date-btn') && !e.target.closest('#sales-end-date-btn')) {
        closeCalendarPopup();
      }
    }
  });

  // Install / APK modal
  document.getElementById('btn-open-install')?.addEventListener('click', () => {
    AudioEngine.playTap();
    document.getElementById('modal-install').classList.add('active');
  });
  document.getElementById('btn-close-install-modal')?.addEventListener('click', closeModals);
  document.getElementById('btn-close-install-btn')?.addEventListener('click', closeModals);
  document.getElementById('btn-export-backup')?.addEventListener('click', exportFullBackupJSON);
  document.getElementById('btn-restore-default-menu')?.addEventListener('click', resetDefaultMenu);

  // Mobile cart drawer toggle
  document.getElementById('btn-mobile-cart-toggle')?.addEventListener('click', () => {
    const cartPanel = document.getElementById('pos-cart-panel');
    if (cartPanel) {
      cartPanel.classList.toggle('mobile-open');
    }
  });

  // PWA Install Prompt Support
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('btn-trigger-pwa-install');
    if (installBtn) {
      installBtn.style.display = 'block';
      installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User choice: ${outcome}`);
          deferredPrompt = null;
        }
      });
    }
  });

  // Register Service Worker for Offline POS Support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      console.log('Yamato POS Service Worker Registered', reg.scope);
    }).catch(err => {
      console.log('Service worker registration failed:', err);
    });
  }
}

// ============================================================================
// APP ENTRY POINT
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  renderCategoriesBar();
  renderCatalog();
  renderCart();
  updateActiveOrdersBadge();
  initEventListeners();
});
