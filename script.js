// Wamokech Coffee Shop - Modern POS System
// Version Française avec devise MAD et images de produits

// Login credentials
const LOGIN_CREDENTIALS = {
    username: 'chakir',
    password: '123'
};

// Application state
let currentUser = null;
let currentView = 'dashboard';
let cart = [];
let orderHistory = JSON.parse(localStorage.getItem('orderHistory')) || [];
let inventory = JSON.parse(localStorage.getItem('inventory')) || [
    { id: 'inv-1', name: 'Grains de Café (Arabica)', quantity: 20, unit: 'kg', price: 150.00, lowStockThreshold: 5 },
    { id: 'inv-2', name: 'Lait Entier', quantity: 12, unit: 'L', price: 10.00, lowStockThreshold: 4 },
    { id: 'inv-3', name: 'Lait d\'Avoine', quantity: 5, unit: 'L', price: 25.00, lowStockThreshold: 2 },
    { id: 'inv-4', name: 'Sirop de Vanille', quantity: 3, unit: 'bouteilles', price: 50.00, lowStockThreshold: 1 },
    { id: 'inv-5', name: 'Sirop de Caramel', quantity: 4, unit: 'bouteilles', price: 50.00, lowStockThreshold: 1 },
    { id: 'inv-6', name: 'Poudre de Cacao', quantity: 2, unit: 'kg', price: 80.00, lowStockThreshold: 0.5 },
    { id: 'inv-7', name: 'Sucre en Morceaux', quantity: 5, unit: 'kg', price: 8.00, lowStockThreshold: 1 },
    { id: 'inv-8', name: 'Gobelets en Carton (M)', quantity: 250, unit: 'pcs', price: 0.50, lowStockThreshold: 50 },
    { id: 'inv-9', name: 'Couvercles (M)', quantity: 240, unit: 'pcs', price: 0.25, lowStockThreshold: 50 },
    { id: 'inv-10', name: 'Eau Minérale (1.5L)', quantity: 24, unit: 'bouteilles', price: 5.00, lowStockThreshold: 6 },
];
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let editingMenuItem = null;
let editingInventoryItem = null;
let editingCustomer = null; // Variable to track the customer being edited

// Menu categories and items
const menuCategories = [
    { id: 'cafes-chauds', name: 'Cafés Chauds', icon: '☕' },
    { id: 'cafes-glaces', name: 'Cafés Glacés', icon: '🧊' },
    { id: 'specialites', name: 'Spécialités', icon: '⭐' },
    { id: 'viennoiseries', name: 'Viennoiseries', icon: '🥐' },
    { id: 'boissons-fraiches', name: 'Boissons Fraîches', icon: '🥤' }
];

let menuItems = JSON.parse(localStorage.getItem('menuItems')) || [
    // Cafés Chauds
    { id: 'hc-1', name: 'Espresso', category: 'cafes-chauds', price: 15.00, imageUrl: 'https://images.unsplash.com/photo-1579992305312-304ac635d36b?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Un shot de café riche et aromatique.', rating: 4.8, time: '2 min' },
    { id: 'hc-2', name: 'Cappuccino', category: 'cafes-chauds', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1557006021-b1da71694b56?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Espresso, lait chaud et mousse de lait onctueuse.', rating: 4.7, time: '4 min' },
    { id: 'hc-3', name: 'Café Latte', category: 'cafes-chauds', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1561882468-91101f2e5f87?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Plus de lait, moins de mousse, doux et crémeux.', rating: 4.6, time: '4 min' },
    { id: 'hc-5', name: 'Americano', category: 'cafes-chauds', price: 18.00, imageUrl: 'https://images.unsplash.com/photo-1595434104141-35111b3331a3?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Un shot d\'espresso allongé avec de l\'eau chaude.', rating: 4.5, time: '3 min' },
    { id: 'hc-6', name: 'Flat White', category: 'cafes-chauds', price: 28.00, imageUrl: 'https://images.unsplash.com/photo-1572452224634-17cb7835d7c5?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Espresso velouté avec une micro-mousse de lait.', rating: 4.8, time: '5 min' },
    { id: 'hc-7', name: 'Cortado', category: 'cafes-chauds', price: 22.00, imageUrl: 'https://images.unsplash.com/photo-1590487823753-6540645a25a2?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Parts égales d\'espresso et de lait chaud pour un goût équilibré.', rating: 4.7, time: '4 min' },
    { id: 'hc-4', name: 'Chocolat Chaud', category: 'cafes-chauds', price: 30.00, imageUrl: 'https://images.unsplash.com/photo-1605651202774-6d9743a11b49?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3', description: 'Chocolat riche et fondant, réconfort garanti.', rating: 4.9, time: '5 min' },

    // Cafés Glacés
    { id: 'ic-1', name: 'Latte Glacé', category: 'cafes-glaces', price: 30.00, imageUrl: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=1985&ixlib=rb-4.0.3', description: 'Espresso et lait froid servis sur glace.', rating: 4.5, time: '3 min' },
    { id: 'ic-4', name: 'Café Glacé', category: 'cafes-glaces', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1511920183353-3c7c421711e3?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Café infusé puis refroidi, servi sur glace. Simple et rafraîchissant.', rating: 4.4, time: '3 min' },
    { id: 'ic-5', name: 'Mocha Glacé', category: 'cafes-glaces', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1621643243446-9a9107954992?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3', description: 'Un mélange gourmand de chocolat, d\'espresso et de lait sur glace.', rating: 4.6, time: '5 min' },
    { id: 'ic-6', name: 'Caramel Frappé', category: 'cafes-glaces', price: 40.00, imageUrl: 'https://images.unsplash.com/photo-1563805327210-2b137456d9a4?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Café, lait et glace mixés avec un filet de caramel.', rating: 4.7, time: '6 min' },
    { id: 'ic-2', name: 'Cold Brew', category: 'cafes-glaces', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1517701550927-4e4b773a8a95?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Infusion à froid pour un café doux et moins acide.', rating: 4.8, time: '3 min' },
    { id: 'ic-3', name: 'Affogato', category: 'cafes-glaces', price: 40.00, imageUrl: 'https://images.unsplash.com/photo-1629587399999-a85244117208?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Boule de glace vanille noyée dans un espresso chaud.', rating: 4.9, time: '4 min' },
    
    // Spécialités
    { id: 'sp-1', name: 'Caramel Macchiato', category: 'specialites', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1576092762262-d927514a3a30?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Gourmandise de vanille, lait, espresso et filet de caramel.', rating: 4.7, time: '5 min' },
    { id: 'sp-2', name: 'Mochaccino', category: 'specialites', price: 35.00, imageUrl: 'https://images.unsplash.com/photo-1542287812-75817ersch?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Le mariage parfait entre le café et le chocolat.', rating: 4.6, time: '5 min' },
    { id: 'sp-3', name: 'Café des Épices', category: 'specialites', price: 30.00, imageUrl: 'https://images.unsplash.com/photo-1512568400610-62da2848a608?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Un café aromatique aux notes de cannelle et de cardamome.', rating: 4.8, time: '5 min' },
    { id: 'sp-4', name: 'Spanish Latte', category: 'specialites', price: 32.00, imageUrl: 'https://images.unsplash.com/photo-1627797742143-601972b216f5?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Espresso adouci avec du lait concentré sucré.', rating: 4.7, time: '5 min' },
    
    // Viennoiseries
    { id: 'vn-1', name: 'Croissant au Beurre', category: 'viennoiseries', price: 10.00, imageUrl: 'https://images.unsplash.com/photo-1587242334273-63110261f364?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3', description: 'Un classique français, léger et feuilleté.', rating: 4.8, time: '1 min' },
    { id: 'vn-2', name: 'Pain au Chocolat', category: 'viennoiseries', price: 12.00, imageUrl: 'https://images.unsplash.com/photo-1620921239921-b6a68f63459c?auto=format&fit=crop&q=80&w=1964&ixlib=rb-4.0.3', description: 'Pâte à croissant avec deux barres de chocolat noir.', rating: 4.7, time: '1 min' },
    { id: 'vn-3', name: 'Muffin Myrtilles', category: 'viennoiseries', price: 20.00, imageUrl: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Muffin moelleux généreusement garni de myrtilles.', rating: 4.5, time: '1 min' },

    // Boissons Fraîches
    { id: 'bf-1', name: 'Jus d\'Orange Pressé', category: 'boissons-fraiches', price: 25.00, imageUrl: 'https://images.unsplash.com/photo-1613478223919-b864fee39319?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Jus d\'oranges fraîches, pressé à la minute.', rating: 4.9, time: '3 min' },
    { id: 'bf-2', name: 'Limonade Maison', category: 'boissons-fraiches', price: 20.00, imageUrl: 'https://images.unsplash.com/photo-1544933339-1b34a17b8304?auto=format&fit=crop&q=80&w=1974&ixlib=rb-4.0.3', description: 'Limonade rafraîchissante au citron et à la menthe.', rating: 4.6, time: '2 min' }
];

let activeCategory = 'cafes-chauds';
let selectedPaymentMethod = 'cash';

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const posSystem = document.getElementById('posSystem');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showPOSSystem();
    } else {
        showLoginScreen();
    }

    setupEventListeners();
});

// Authentication Functions
function showLoginScreen() {
    loginScreen.style.display = 'flex';
    posSystem.style.display = 'none';
}

function showPOSSystem() {
    loginScreen.style.display = 'none';
    posSystem.style.display = 'flex';
    initializePOSSystem();
}

function login(username, password) {
    if (username === LOGIN_CREDENTIALS.username && password === LOGIN_CREDENTIALS.password) {
        currentUser = { username, loginTime: new Date() };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showPOSSystem();
        showToast('Connexion Réussie', `Bienvenue, ${username} !`, 'success');
        return true;
    }
    return false;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    cart = [];
    showLoginScreen();
    showToast('Déconnecté', 'Session terminée avec succès', 'success');
}

// Event Listeners Setup
function setupEventListeners() {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            loginError.style.display = 'none';
        } else {
            loginError.style.display = 'block';
            showToast('Échec de la Connexion', 'Identifiants invalides', 'error');
        }
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchView(this.dataset.view);
        });
    });

    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('clearDashboard').addEventListener('click', clearDashboard);
    document.getElementById('clearActivityBtn').addEventListener('click', clearRecentActivity);
    document.getElementById('clearHistoryBtn')?.addEventListener('click', clearOrderHistory); // Use optional chaining
    document.getElementById('clearCartBtn')?.addEventListener('click', clearCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', processTransaction);

    setupModals();
    setupPaymentModal();
    setupReceiptModal();
    setupMenuItemModal();
    setupOrderStatusModal();
    setupInventoryManagement();
    setupCustomerManagement();
    document.getElementById('orderStatusFilter')?.addEventListener('change', renderBills);
    document.getElementById('clearAllBillsBtn')?.addEventListener('click', clearOrderHistory); // Listener for the new button
}

// POS System Initialization
function initializePOSSystem() {
    document.getElementById('currentUser').textContent = `Bienvenue, ${currentUser.username} !`;
    renderCategoryTabs();
    populateCategoryDropdown();
    renderMenuGrid();
    renderCart();
    updateDashboard();
    switchView('dashboard');
}

// View Management
function switchView(viewName) {
    currentView = viewName;
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === viewName);
    });
    document.querySelectorAll('.view-content').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + 'View').classList.add('active');
    
    if (viewName === 'dashboard') {
        updateDashboard();
    } else if (viewName === 'menu') {
        renderMenuGrid();
        renderCart();
        renderHorizontalOrderList();
    } else if (viewName === 'inventory') {
        renderInventory();
    } else if (viewName === 'customers') {
        renderCustomers();
    } else if (viewName === 'bills') {
        renderBills();
    }
}

// Dashboard Functions
function updateDashboard() {
    const today = new Date().toDateString();
    const completedOrders = orderHistory.filter(order => order.status === 'completed');
    const todaySales = orderHistory.reduce((sum, order) => {
        const orderDate = new Date(order.timestamp).toDateString();
        if (orderDate === today && order.status !== 'canceled') {
            return sum + order.total;
        }
        return sum;
    }, 0);

    document.getElementById('todaySales').textContent = `${todaySales.toFixed(2)} MAD`;
    document.getElementById('totalOrders').textContent = orderHistory.length;
    document.getElementById('menuItemCount').textContent = menuItems.length;
    document.getElementById('customerCount').textContent = customers.length;

    const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    document.getElementById('avgOrderValue').textContent = `${avgOrderValue.toFixed(2)} MAD`;

    const itemCounts = {};
    completedOrders.forEach(order => {
        order.items.forEach(item => {
            itemCounts[item.id] = (itemCounts[item.id] || 0) + item.quantity;
        });
    });

    let popularItemId = null;
    let maxCount = 0;
    for (const itemId in itemCounts) {
        if (itemCounts[itemId] > maxCount) {
            maxCount = itemCounts[itemId];
            popularItemId = itemId;
        }
    }
    const popularItem = popularItemId ? menuItems.find(item => item.id === popularItemId) : null;
    const popularItemEl = document.getElementById('popularItem');
    if (popularItem) {
        popularItemEl.textContent = popularItem.name;
        popularItemEl.title = `${popularItem.name} (vendu ${maxCount} fois)`;
    } else {
        popularItemEl.textContent = 'N/A';
        popularItemEl.title = 'Aucune vente enregistrée';
    }

    renderDashboardOrderList();
    renderRecentActivity();
}

function renderDashboardOrderList() {
    const container = document.getElementById('orderList');
    const recentOrders = orderHistory.slice(0, 5);
    
    if (recentOrders.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-shopping-cart"></i><h3>Aucune commande récente</h3><p>Les commandes apparaîtront ici</p></div>';
        return;
    }
    
    container.innerHTML = recentOrders.map(order => {
        const statusTranslations = { pending: 'En attente', completed: 'Terminée', canceled: 'Annulée' };
        return `
        <div class="order-item">
            <div class="order-info">
                <h4>Commande #${order.orderNumber}</h4>
                <p>${new Date(order.timestamp).toLocaleTimeString()}</p>
            </div>
            <div class="order-status ${order.status}" onclick="openOrderStatusModal('${order.id}')">
                ${statusTranslations[order.status]}
            </div>
        </div>
    `}).join('');
}

function renderRecentActivity() {
    const container = document.getElementById('recentActivity');
    const activities = [
        { type: 'order', text: 'Nouvelle commande passée', time: 'il y a 2 min' },
        { type: 'payment', text: 'Paiement traité', time: 'il y a 5 min' },
        { type: 'inventory', text: 'Stock mis à jour', time: 'il y a 10 min' },
        { type: 'customer', text: 'Nouveau client ajouté', time: 'il y a 15 min' }
    ];
    
    container.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="fas fa-${activity.type === 'order' ? 'shopping-cart' : 
                                   activity.type === 'payment' ? 'credit-card' : 
                                   activity.type === 'inventory' ? 'boxes' : 'user'}"></i>
            </div>
            <div class="activity-info">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

function clearDashboard() {
    if (confirm('Êtes-vous sûr de vouloir vider la commande actuelle (le panier) ?')) {
        cart = [];
        renderCart();
        showToast('Panier vidé', 'La commande actuelle a été vidée.', 'success');
    }
}

function clearRecentActivity() {
    if (confirm('Êtes-vous sûr de vouloir effacer l\'activité récente ?')) {
        const activityContainer = document.getElementById('recentActivity');
        if (activityContainer) {
            activityContainer.innerHTML = `
                <div class="empty-state" style="padding: 20px;">
                    <i class="fas fa-history"></i>
                    <p>Activité effacée</p>
                </div>`;
        }
        showToast('Activité Effacée', 'L\'historique de session a été effacé.', 'success');
    }
}

function clearOrderHistory() {
    if (confirm('ATTENTION ! Êtes-vous sûr de vouloir effacer TOUT l\'historique des commandes et les statistiques ? Cette action est irréversible.')) {
        orderHistory = [];
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        // Update all relevant views
        updateDashboard();
        if (currentView === 'bills') {
            renderBills();
        }
        if (currentView === 'customers') {
            renderCustomers();
        }
        
        showToast('Historique Effacé', 'Toutes les commandes et statistiques ont été supprimées.', 'warning');
    }
}

// Menu Functions
function renderCategoryTabs() {
    const container = document.getElementById('categoryTabs');
    if (!container) return;
    
    container.innerHTML = menuCategories.map(category => `
        <button class="category-tab ${activeCategory === category.id ? 'active' : ''}" 
                onclick="switchCategory('${category.id}')">
            ${category.icon} ${category.name}
        </button>
    `).join('');
}

function switchCategory(categoryId) {
    activeCategory = categoryId;
    renderCategoryTabs();
    renderMenuGrid();
}

function renderMenuGrid() {
    const container = document.getElementById('menuGrid');
    const showingElement = document.getElementById('menuItemsShowing');
    if (!container) return;
    
    let filteredItems = menuItems.filter(item => item.category === activeCategory);
    
    if (showingElement) showingElement.textContent = filteredItems.length;
    
    if (filteredItems.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-utensils"></i><h3>Aucun article dans cette catégorie</h3><p>Ajoutez des articles pour les voir ici</p></div>`;
        return;
    }
    
    container.innerHTML = filteredItems.map(item => `
        <div class="menu-item" onclick="addToCart('${item.id}')">
            <div class="menu-item-actions">
                <button class="menu-action-btn edit-menu-btn" onclick="event.stopPropagation(); editMenuItem('${item.id}')"><i class="fas fa-edit"></i></button>
                <button class="menu-action-btn delete-menu-btn" onclick="event.stopPropagation(); deleteMenuItem('${item.id}')"><i class="fas fa-trash"></i></button>
            </div>
            <div class="item-image">
                ${item.imageUrl ? `<img src="${item.imageUrl}" alt="${item.name}">` : `<span style="font-size: 3rem;">${item.image || '☕'}</span>`}
            </div>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-footer">
                    <div class="item-price">${item.price.toFixed(2)}</div>
                    <div class="item-meta">
                        <div class="item-rating"><i class="fas fa-star" style="color: #ffc107;"></i><span>${item.rating}</span></div>
                        <div class="item-time"><i class="fas fa-clock"></i><span>${item.time}</span></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderHorizontalOrderList() {
    const container = document.getElementById('horizontalOrderList');
    if (!container) return;

    const pendingOrders = orderHistory.filter(order => order.status === 'pending');

    if (pendingOrders.length === 0) {
        container.innerHTML = '<div class="empty-state horizontal"><p>Aucune commande en préparation.</p></div>';
        return;
    }

    container.innerHTML = pendingOrders.map(order => {
        const customerInfo = order.customerName || `Table ${order.table}` || 'À Emporter';
        return `
            <div class="horizontal-order-item" onclick="openOrderStatusModal('${order.id}')">
                <div class="horizontal-order-info">
                    <strong>#${order.orderNumber}</strong>
                    <span>${customerInfo}</span>
                </div>
                <div class="order-status ${order.status}">
                    En attente
                </div>
            </div>
        `;
    }).join('');
}

// Menu Item Management
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('menuItemCategory');
    if (!categorySelect) return;
    categorySelect.innerHTML = '<option value="">Sélectionner une catégorie</option>';
    menuCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}

function setupMenuItemModal() {
    document.getElementById('addMenuItem')?.addEventListener('click', function() {
        editingMenuItem = null;
        document.getElementById('menuItemModalTitle').textContent = 'Ajouter un Article au Menu';
        document.getElementById('submitMenuItemBtn').textContent = 'Ajouter l\'Article';
        document.getElementById('addMenuItemForm').reset();
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('addMenuItemModal').classList.add('show');
    });
    
    document.getElementById('menuItemImage')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('previewImg').src = e.target.result;
                document.getElementById('imagePreview').style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            document.getElementById('imagePreview').style.display = 'none';
        }
    });
    
    document.getElementById('addMenuItemForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveMenuItem();
    });
}

function editMenuItem(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    editingMenuItem = item;
    document.getElementById('menuItemModalTitle').textContent = 'Modifier l\'Article du Menu';
    document.getElementById('submitMenuItemBtn').textContent = 'Mettre à jour';
    
    document.getElementById('menuItemName').value = item.name;
    document.getElementById('menuItemCategory').value = item.category;
    document.getElementById('menuItemPrice').value = item.price;
    document.getElementById('menuItemDescription').value = item.description;
    document.getElementById('menuItemRating').value = item.rating;
    document.getElementById('menuItemTime').value = item.time;
    
    if (item.imageUrl) {
        document.getElementById('previewImg').src = item.imageUrl;
        document.getElementById('imagePreview').style.display = 'block';
    } else {
        document.getElementById('imagePreview').style.display = 'none';
    }
    
    document.getElementById('addMenuItemModal').classList.add('show');
}

function deleteMenuItem(itemId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article du menu ?')) {
        const item = menuItems.find(i => i.id === itemId);
        menuItems = menuItems.filter(i => i.id !== itemId);
        localStorage.setItem('menuItems', JSON.stringify(menuItems));
        
        renderMenuGrid();
        updateDashboard();
        
        if (item) {
            showToast('Article Supprimé', `${item.name} a été retiré du menu`, 'warning');
        }
    }
}

function saveMenuItem() {
    const name = document.getElementById('menuItemName').value;
    const category = document.getElementById('menuItemCategory').value;
    const price = parseFloat(document.getElementById('menuItemPrice').value);
    const description = document.getElementById('menuItemDescription').value;
    const rating = parseFloat(document.getElementById('menuItemRating').value);
    const time = document.getElementById('menuItemTime').value;
    const imageFile = document.getElementById('menuItemImage').files[0];
    
    const itemData = { name, category, price, description, rating, time, image: '☕' };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            itemData.imageUrl = e.target.result;
            saveItemToStorage(itemData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        if (editingMenuItem && editingMenuItem.imageUrl) {
            itemData.imageUrl = editingMenuItem.imageUrl;
        }
        saveItemToStorage(itemData);
    }
}

function saveItemToStorage(itemData) {
    if (editingMenuItem) {
        const index = menuItems.findIndex(i => i.id === editingMenuItem.id);
        if (index !== -1) {
            menuItems[index] = { ...editingMenuItem, ...itemData };
            showToast('Article Mis à Jour', `${itemData.name} mis à jour avec succès`, 'success');
        }
    } else {
        const newItem = { id: `custom-${Date.now()}`, ...itemData };
        menuItems.push(newItem);
        showToast('Article Ajouté', `${itemData.name} ajouté au menu`, 'success');
    }
    
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
    
    document.getElementById('addMenuItemModal').classList.remove('show');
    renderMenuGrid();
    updateDashboard();
}

// Order Status Management
function setupOrderStatusModal() {
    document.getElementById('updateOrderStatus')?.addEventListener('click', function() {
        const selectedStatus = document.querySelector('input[name="statusUpdate"]:checked')?.value;
        if (selectedStatus && window.currentOrderId) {
            updateOrderStatus(window.currentOrderId, selectedStatus);
        }
    });
}

function openOrderStatusModal(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (!order) return;
    
    window.currentOrderId = orderId;
    
    document.getElementById('statusOrderNumber').textContent = `Commande #${order.orderNumber}`;
    document.getElementById('statusOrderDetails').textContent = 
        `${new Date(order.timestamp).toLocaleString()} - ${order.total.toFixed(2)} MAD`;
    
    document.querySelector(`input[value="${order.status}"]`).checked = true;
    
    document.getElementById('orderStatusModal').classList.add('show');
}

function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orderHistory.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orderHistory[orderIndex].status = newStatus;
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        
        document.getElementById('orderStatusModal').classList.remove('show');
        
        updateDashboard();
        renderBills();
        renderHorizontalOrderList();
        
        const statusTranslations = { pending: 'en attente', completed: 'terminée', canceled: 'annulée' };
        showToast('Statut Mis à Jour', `Statut de la commande changé à ${statusTranslations[newStatus]}`, 'success');
    }
}

// Cart Functions
function addToCart(itemId) {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;
    
    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    
    if (existingItem) existingItem.quantity++;
    else cart.push({ ...item, quantity: 1 });
    
    renderCart();
    showToast('Ajouté à la Commande', `${item.name} ajouté`, 'success');
}

function updateCartQuantity(itemId, change) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) removeFromCart(itemId);
        else renderCart();
    }
}

function removeFromCart(itemId) {
    const item = cart.find(cartItem => cartItem.id === itemId);
    cart = cart.filter(cartItem => cartItem.id !== itemId);
    renderCart();
    
    if (item) {
        showToast('Retiré', `${item.name} retiré de la commande`, 'warning');
    }
}

function clearCart() {
    cart = [];
    renderCart();
    showToast('Commande Vidée', 'Tous les articles ont été retirés', 'warning');
}

function renderCart() {
    const orderSummaryContainer = document.getElementById('orderSummaryItems');
    const orderItemCountElement = document.getElementById('orderItemCount');
    
    if (!orderSummaryContainer) return;
    
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal;
    
    if (orderItemCountElement) orderItemCountElement.textContent = `${itemCount} Article${itemCount !== 1 ? 's' : ''}`;
    
    if (cart.length === 0) {
        orderSummaryContainer.innerHTML = `<div class="empty-state"><i class="fas fa-coffee"></i><h3>Votre commande est vide</h3><p>Ajoutez de délicieux articles !</p></div>`;
    } else {
        orderSummaryContainer.innerHTML = cart.map(item => `
            <div class="order-summary-item"><div class="item-details"><h5>${item.name}</h5><p>${item.price.toFixed(2)} MAD l'unité</p></div>
            <div class="item-controls"><div class="quantity-controls">
            <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', -1)"><i class="fas fa-minus"></i></button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn" onclick="updateCartQuantity('${item.id}', 1)"><i class="fas fa-plus"></i></button>
            </div><button class="remove-btn" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button></div></div>`).join('');
    }
    
    document.getElementById('subtotalAmount').textContent = `${subtotal.toFixed(2)} MAD`;
    document.getElementById('totalAmount').textContent = `${total.toFixed(2)} MAD`;
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

// Transaction Processing
function processTransaction() {
    if (cart.length === 0) {
        showToast('Commande Vide', 'Ajoutez des articles pour continuer', 'error');
        return;
    }
    openPaymentModal();
}

function calculateChange() {
    const cashAmountInput = document.getElementById('cashAmount');
    if (!cashAmountInput) return;

    const cashAmount = parseFloat(cashAmountInput.value) || 0;
    const changeDisplay = document.getElementById('changeDisplay');
    const changeAmountEl = document.getElementById('changeAmount');
    const discountInput = document.getElementById('discountAmount').value;

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let total = subtotal;
    let discount = 0;

    if (discountInput) {
        if (discountInput.includes('%')) {
            discount = subtotal * (parseFloat(discountInput) / 100);
        } else {
            discount = parseFloat(discountInput) || 0;
        }
        total = Math.max(0, subtotal - discount);
    }
    
    if (cashAmount > 0 && selectedPaymentMethod === 'cash') {
        const change = cashAmount - total;
        changeAmountEl.textContent = `${change.toFixed(2)} MAD`;
        changeDisplay.style.display = 'flex';

        if (change < 0) {
            changeAmountEl.style.color = '#c62828';
        } else {
            changeAmountEl.style.color = '#28a745';
        }
    } else {
        changeDisplay.style.display = 'none';
    }
}

// Payment Modal Functions
function populateCustomerSelect() {
    const customerSelect = document.getElementById('customerSelect');
    if (!customerSelect) return;

    const savedValue = customerSelect.value;
    
    const firstOption = customerSelect.options[0];
    const lastOption = customerSelect.options[customerSelect.options.length - 1];
    customerSelect.innerHTML = '';
    customerSelect.appendChild(firstOption);

    customers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.name;
        option.textContent = customer.name;
        customerSelect.appendChild(option);
    });

    customerSelect.appendChild(lastOption);
    customerSelect.value = savedValue;
}

function setupPaymentModal() {
    document.querySelectorAll('.payment-method').forEach(method => {
        method.addEventListener('click', function() {
            document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.dataset.method;
            
            const cashFieldGroup = document.getElementById('cashSection');
            if (selectedPaymentMethod === 'cash') {
                cashFieldGroup.style.display = 'block';
            } else {
                cashFieldGroup.style.display = 'none';
                document.getElementById('changeDisplay').style.display = 'none';
            }
        });
    });

    document.getElementById('customerSelect')?.addEventListener('change', function(e) {
        const customWrapper = document.getElementById('customCustomerWrapper');
        if (e.target.value === 'custom') {
            customWrapper.style.display = 'block';
        } else {
            customWrapper.style.display = 'none';
        }
    });

    document.getElementById('cashAmount')?.addEventListener('input', calculateChange);
    document.getElementById('discountAmount')?.addEventListener('input', calculateChange);
    document.getElementById('completePaymentBtn')?.addEventListener('click', completePayment);
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    document.getElementById('paymentOrderItems').innerHTML = cart.map(item => `
        <div class="payment-order-item"><span>${item.quantity}x ${item.name}</span><span>${(item.price * item.quantity).toFixed(2)} MAD</span></div>`).join('');
    
    document.getElementById('paymentTotalAmount').textContent = `${subtotal.toFixed(2)} MAD`;
    
    selectedPaymentMethod = 'cash';
    document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
    document.querySelector('[data-method="cash"]').classList.add('active');
    document.getElementById('cashSection').style.display = 'block';
    document.getElementById('cashAmount').value = '';
    document.getElementById('discountAmount').value = '';
    document.getElementById('changeDisplay').style.display = 'none';
    document.getElementById('tableSelect').value = '';
    
    populateCustomerSelect();
    document.getElementById('customerSelect').value = '';
    document.getElementById('customCustomerWrapper').style.display = 'none';
    document.getElementById('customCustomerName').value = '';

    document.querySelector('input[name="orderType"][value="dine-in"]').checked = true;
    document.getElementById('orderStatus').value = 'completed';
    
    modal.classList.add('show');
}

function completePayment() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let total = subtotal;
    const discountInput = document.getElementById('discountAmount').value;
    let discount = 0;
    if (discountInput) {
        if (discountInput.includes('%')) {
            discount = subtotal * (parseFloat(discountInput) / 100);
        } else {
            discount = parseFloat(discountInput) || 0;
        }
        total = Math.max(0, subtotal - discount);
    }
    
    if (selectedPaymentMethod === 'cash') {
        const cashAmount = parseFloat(document.getElementById('cashAmount').value);
        if (isNaN(cashAmount) || cashAmount < total) {
            showToast('Montant Insuffisant', 'Veuillez entrer un montant valide', 'error');
            return;
        }
    }

    let finalCustomerName = document.getElementById('customerSelect').value;
    if (finalCustomerName === 'custom') {
        finalCustomerName = document.getElementById('customCustomerName').value;
    }
    
    const newOrder = {
        id: `order-${Date.now()}`,
        orderNumber: `WC${String(orderHistory.length + 1).padStart(3, '0')}`,
        items: [...cart],
        subtotal, discount, total,
        paymentMethod: selectedPaymentMethod,
        table: document.getElementById('tableSelect').value,
        customerName: finalCustomerName,
        orderType: document.querySelector('input[name="orderType"]:checked').value,
        status: document.getElementById('orderStatus').value,
        timestamp: new Date()
    };
    
    orderHistory.unshift(newOrder);
    localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
    
    cart = [];
    renderCart();
    document.getElementById('paymentModal').classList.remove('show');
    
    openReceiptModal(newOrder);
    if (currentView === 'dashboard') {
        updateDashboard();
    }
    if (currentView === 'menu') {
        renderHorizontalOrderList();
    }
    if (currentView === 'customers') {
        renderCustomers();
    }
    
    showToast('Paiement Réussi', `Commande ${newOrder.orderNumber} finalisée`, 'success');
}

// Receipt Modal Functions
function setupReceiptModal() {
    document.getElementById('printReceipt')?.addEventListener('click', printReceipt);
    document.getElementById('downloadReceipt')?.addEventListener('click', downloadReceipt);
}

function openReceiptModal(orderData) {
    document.getElementById('receiptContent').innerHTML = generateReceiptHTML(orderData);
    document.getElementById('receiptModal').classList.add('show');
}

function generateReceiptHTML(order) {
    const cashReceived = parseFloat(document.getElementById('cashAmount')?.value || 0);
    const change = order.paymentMethod === 'cash' && cashReceived > 0 ? (cashReceived - order.total) : 0;
    const statusTranslations = { pending: 'EN ATTENTE', completed: 'TERMINÉE', canceled: 'ANNULÉE' };

    return `
        <div class="receipt-shop-info"><h3>☕ Wamokech Coffee Shop</h3><p>Café de Spécialité & Pâtisseries</p><p>Merci de votre visite !</p></div>
        <div class="receipt-order-info">
            <strong>Commande #${order.orderNumber}</strong><br>
            ${new Date(order.timestamp).toLocaleString('fr-FR')}<br>
            Statut: ${statusTranslations[order.status]}<br>
            ${order.table ? `Table: ${order.table}<br>` : ''}
            ${order.customerName ? `Client: ${order.customerName}<br>` : ''}
            Type: ${order.orderType === 'dine-in' ? 'Sur Place' : 'À Emporter'}<br>
        </div>
        <div class="receipt-items">
            <strong>ARTICLES :</strong><br>
            ${order.items.map(item => `<div class="receipt-item"><span>${item.quantity}x ${item.name}</span><span>${(item.price * item.quantity).toFixed(2)} MAD</span></div>
            <div style="margin-left: 20px; font-size: 0.9em; color: #666;">${item.price.toFixed(2)} MAD l'unité</div>`).join('')}
        </div>
        <div class="receipt-totals">
            <div class="receipt-total-line"><span>Sous-total:</span><span>${order.subtotal.toFixed(2)} MAD</span></div>
            ${order.discount > 0 ? `<div class="receipt-total-line"><span>Remise:</span><span>-${order.discount.toFixed(2)} MAD</span></div>` : ''}
            <div class="receipt-total-line final"><span>TOTAL:</span><span>${order.total.toFixed(2)} MAD</span></div>
            <div style="margin-top: 15px;">
                <div class="receipt-total-line"><span>Méthode de Paiement:</span><span>${order.paymentMethod.toUpperCase() === 'CASH' ? 'ESPÈCES' : 'CARTE'}</span></div>
                ${order.paymentMethod === 'cash' && change >= 0 ? `<div class="receipt-total-line"><span>Rendu:</span><span>${change.toFixed(2)} MAD</span></div>` : ''}
            </div>
        </div>
        <div class="receipt-footer"><p>Suivez-nous @wamokechcoffee</p></div>`;
}

function printReceipt() {
    const printContent = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Reçu</title><style>body { font-family: 'Courier New', monospace; margin: 20px; line-height: 1.4; }.receipt-shop-info, .receipt-footer { text-align: center; } .receipt-item, .receipt-total-line { display: flex; justify-content: space-between; margin-bottom: 5px; } .final { font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }</style></head><body>${printContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
}

function downloadReceipt() {
    const receiptText = document.getElementById('receiptContent').innerText;
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-${new Date().getTime()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Bills Management
function renderBills() {
    const container = document.getElementById('billsGrid');
    const filter = document.getElementById('orderStatusFilter')?.value || 'all';
    if (!container) return;
    
    let filteredOrders = (filter === 'all') ? orderHistory : orderHistory.filter(o => o.status === filter);
    
    if (filteredOrders.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-receipt"></i><h3>Aucune facture disponible</h3><p>Les factures des commandes terminées apparaîtront ici.</p></div>`;
        return;
    }

    const statusTranslations = { pending: 'EN ATTENTE', completed: 'TERMINÉE', canceled: 'ANNULÉE' };
    const paymentTranslations = { cash: 'ESPÈCES', card: 'CARTE' };
    
    container.innerHTML = filteredOrders.map(order => `
        <div class="bill-item">
            <div class="bill-info">
                <h4>Commande #${order.orderNumber}</h4>
                <p>${new Date(order.timestamp).toLocaleDateString('fr-FR')}</p>
                <p><strong>${order.total.toFixed(2)} MAD</strong></p>
                <p>Statut: <span class="order-status ${order.status}">${statusTranslations[order.status]}</span></p>
                <p>${paymentTranslations[order.paymentMethod]}</p>
            </div>
            <div class="bill-actions">
                <button class="view-btn" onclick="viewBill('${order.id}')"><i class="fas fa-eye"></i></button>
                <button class="edit-btn" onclick="openOrderStatusModal('${order.id}')"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" onclick="deleteBill('${order.id}')"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function viewBill(orderId) {
    const order = orderHistory.find(o => o.id === orderId);
    if (order) openReceiptModal(order);
}

function deleteBill(orderId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
        orderHistory = orderHistory.filter(o => o.id !== orderId);
        localStorage.setItem('orderHistory', JSON.stringify(orderHistory));
        renderBills();
        updateDashboard();
        showToast('Facture Supprimée', 'Facture retirée avec succès', 'warning');
    }
}

// Inventory Management
function setupInventoryManagement() {
    document.getElementById('addInventoryItem')?.addEventListener('click', function() {
        editingInventoryItem = null;
        document.getElementById('addInventoryForm').reset();
        document.getElementById('addInventoryModal').classList.add('show');
    });
    
    document.getElementById('addInventoryForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const itemData = {
            name: document.getElementById('inventoryName').value,
            quantity: parseFloat(document.getElementById('inventoryQuantity').value),
            unit: document.getElementById('inventoryUnit').value,
            price: parseFloat(document.getElementById('inventoryPrice').value),
            lowStockThreshold: parseFloat(document.getElementById('inventoryThreshold').value)
        };

        if(editingInventoryItem) {
            const index = inventory.findIndex(i => i.id === editingInventoryItem.id);
            inventory[index] = { ...editingInventoryItem, ...itemData };
            showToast('Article Mis à Jour', `${itemData.name} mis à jour dans l'inventaire`, 'success');
        } else {
            const newItem = { id: `inv-${Date.now()}`, ...itemData };
            inventory.push(newItem);
            showToast('Article Ajouté', `${itemData.name} ajouté à l'inventaire`, 'success');
        }
        
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        this.reset();
        document.getElementById('addInventoryModal').classList.remove('show');
        renderInventory();
    });
}

function renderInventory() {
    const container = document.getElementById('inventoryGrid');
    if (!container) return;
    
    if (inventory.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-boxes"></i>
                <h3>Aucun article en inventaire</h3>
                <p>Ajoutez des articles pour suivre votre stock.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = inventory.map(item => {
        const isLowStock = item.quantity <= item.lowStockThreshold;
        return `
        <div class="inventory-item ${isLowStock ? 'low-stock' : ''}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Quantité: ${item.quantity} ${item.unit || ''}</p>
                <p>Prix d'achat: ${item.price.toFixed(2)} MAD</p>
                ${isLowStock ? `<p class="low-stock-warning"><i class="fas fa-exclamation-triangle"></i> Stock bas</p>` : ''}
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editInventoryItem('${item.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" onclick="deleteInventoryItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `}).join('');
}

function editInventoryItem(itemId) {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;
    
    editingInventoryItem = item;

    document.getElementById('inventoryName').value = item.name;
    document.getElementById('inventoryQuantity').value = item.quantity;
    document.getElementById('inventoryUnit').value = item.unit;
    document.getElementById('inventoryPrice').value = item.price;
    document.getElementById('inventoryThreshold').value = item.lowStockThreshold;
    
    document.getElementById('addInventoryModal').classList.add('show');
}

function deleteInventoryItem(itemId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article de l\'inventaire ?')) {
        const item = inventory.find(i => i.id === itemId);
        inventory = inventory.filter(i => i.id !== itemId);
        localStorage.setItem('inventory', JSON.stringify(inventory));
        
        renderInventory();
        
        if (item) {
            showToast('Article Supprimé', `${item.name} retiré de l'inventaire`, 'warning');
        }
    }
}


// Customer Management
function setupCustomerManagement() {
    document.getElementById('addCustomer')?.addEventListener('click', () => {
        editingCustomer = null;
        document.getElementById('customerModalTitle').textContent = 'Ajouter un Client';
        document.getElementById('submitCustomerBtn').textContent = 'Ajouter Client';
        document.getElementById('addCustomerForm').reset();
        document.getElementById('addCustomerModal').classList.add('show');
    });

    document.getElementById('addCustomerForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const customerData = {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value
        };

        if (editingCustomer) {
            const index = customers.findIndex(c => c.id === editingCustomer.id);
            if (index !== -1) {
                customers[index] = { ...editingCustomer, ...customerData };
                showToast('Client Mis à Jour', `${customerData.name} mis à jour avec succès`, 'success');
            }
        } else {
            const newCustomer = { id: `cust-${Date.now()}`, ...customerData };
            customers.push(newCustomer);
            showToast('Client Ajouté', `${newCustomer.name} ajouté avec succès`, 'success');
        }
        
        localStorage.setItem('customers', JSON.stringify(customers));
        this.reset();
        editingCustomer = null;
        document.getElementById('addCustomerModal').classList.remove('show');
        renderCustomers();
        updateDashboard();
    });
}

function renderCustomers() {
    const container = document.getElementById('customersGrid');
    if (!container) return;
    if (customers.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><i class="fas fa-users"></i><h3>Aucun client</h3><p>Ajoutez des clients pour suivre leurs informations.</p></div>`;
        return;
    }

    container.innerHTML = customers.map(c => {
        const customerOrders = orderHistory.filter(order =>
            order.customerName === c.name && order.status === 'completed'
        );
        const orderCount = customerOrders.length;
        const totalSpent = customerOrders.reduce((sum, order) => sum + order.total, 0);

        return `
            <div class="customer-item">
                <div class="customer-info">
                    <h4>${c.name}</h4>
                    <p><i class="fas fa-phone fa-fw"></i> ${c.phone || 'N/A'}</p>
                    <p><i class="fas fa-envelope fa-fw"></i> ${c.email || 'N/A'}</p>
                    <p style="margin-top: 10px;"><i class="fas fa-receipt fa-fw"></i> Commandes: <strong>${orderCount}</strong></p>
                    <p><i class="fas fa-hand-holding-usd fa-fw"></i> Dépensé: <strong>${totalSpent.toFixed(2)} MAD</strong></p>
                </div>
                <div class="customer-actions">
                    <button class="edit-btn" onclick="editCustomer('${c.id}')"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" onclick="deleteCustomer('${c.id}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
    }).join('');
}

function editCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
        editingCustomer = customer;
        document.getElementById('customerModalTitle').textContent = 'Modifier le Client';
        document.getElementById('submitCustomerBtn').textContent = 'Mettre à jour';
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerPhone').value = customer.phone || '';
        document.getElementById('customerEmail').value = customer.email || '';
        document.getElementById('addCustomerModal').classList.add('show');
    }
}

function deleteCustomer(customerId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
        const customer = customers.find(c => c.id === customerId);
        customers = customers.filter(c => c.id !== customerId);
        localStorage.setItem('customers', JSON.stringify(customers));
        renderCustomers();
        updateDashboard();
        if (customer) showToast('Client Supprimé', `${customer.name} retiré`, 'warning');
    }
}


// Modal Management & Utilities
function setupModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('show'); });
    });
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() { this.closest('.modal').classList.remove('show'); });
    });
}

function showToast(title, message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle' };
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><div class="toast-content"><h4>${title}</h4><p>${message}</p></div>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
}

document.getElementById('exportBills')?.addEventListener('click', function() {
    if (orderHistory.length === 0) { showToast('Pas de Données', 'Aucune facture à exporter', 'warning'); return; }
    const csvContent = [
        ['Numéro Commande', 'Date', 'Total (MAD)', 'Paiement', 'Statut', 'Articles'],
        ...orderHistory.map(order => [
            order.orderNumber, new Date(order.timestamp).toLocaleDateString('fr-FR'),
            order.total.toFixed(2), order.paymentMethod.toUpperCase(), order.status.toUpperCase(),
            order.items.map(item => `${item.quantity}x ${item.name}`).join('; ')
        ])
    ].map(row => row.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export-factures-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exportation Terminée', 'Factures exportées avec succès', 'success');
});

// Make functions available globally for inline HTML onclicks
window.switchCategory = switchCategory;
window.addToCart = addToCart;
window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;
window.editMenuItem = editMenuItem;
window.deleteMenuItem = deleteMenuItem;
window.openOrderStatusModal = openOrderStatusModal;
window.editInventoryItem = editInventoryItem;
window.deleteInventoryItem = deleteInventoryItem;
window.editCustomer = editCustomer;
window.deleteCustomer = deleteCustomer;
window.viewBill = viewBill;
window.deleteBill = deleteBill;