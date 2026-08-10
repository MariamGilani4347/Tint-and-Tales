// Global variables
let currentUser = null;
let cart = [];

 
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    
    loadUserSession();
    loadCart();
    initializeHeroSlider();
    initializeMenuToggle();
    initializeModals();
    initializeAuth();
    initializeCart();
    initializeSearch();
    initializeNavigation();
    updateUI();
    console.log('Just4Girls website with enhanced functionality loaded successfully!');
}

// Hero Slider Functionality
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    let currentSlide = 0;
    let slideInterval;

    if (!slides.length) return;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(slideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            showSlide(index);
            startAutoSlide();
        });
    });

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }

    showSlide(0);
    startAutoSlide();
}

// Menu Toggle Functionality
function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuOverlay.classList.add('active');
        });
    }

    if (menuClose) {
        menuClose.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
        });
    }

    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) {
                menuOverlay.classList.remove('active');
            }
        });
    }
}
    // Menu navigation
    const menuLinks = document.querySelectorAll('.menu-nav a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
        // allow normal navigation to href
    });
});
  // Authentication System
function initializeAuth() {
    const loginRegisterBtn = document.getElementById('loginRegisterBtn');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginRegisterBtn) {
        loginRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                openModal('accountModal');
                displayAccountInfo();
            } else {
                openModal('loginModal');
            }
        });
    }

    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('registerModal');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openModal('loginModal');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('loginModal');
        updateUI();
        showNotification('Login successful!', 'success');
        document.getElementById('loginForm').reset();
    } else {
        showNotification('Invalid email or password!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    closeModal('registerModal');
    updateUI();
    showNotification('Registration successful!', 'success');
    document.getElementById('registerForm').reset();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    closeModal('accountModal');
    updateUI();
    showNotification('Logged out successfully!', 'success');
}

function loadUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function displayAccountInfo() {
    const accountInfo = document.getElementById('accountInfo');
    if (currentUser && accountInfo) {
        accountInfo.innerHTML = `
            <div class="account-field">
                <label>Name:</label>
                <span>${currentUser.name}</span>
            </div>
            <div class="account-field">
                <label>Email:</label>
                <span>${currentUser.email}</span>
            </div>
            <div class="account-field">
                <label>Phone:</label>
                <span>${currentUser.phone}</span>
            </div>
            <div class="account-field">
                <label>Address:</label>
                <span>${currentUser.address}</span>
            </div>
            <div class="account-field">
                <label>Member Since:</label>
                <span>${new Date(currentUser.registeredAt).toLocaleDateString()}</span>
            </div>
        `;
    }
}

  
   // Wishlist System
// ✅ Add to Wishlist
function addToWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistBadge();
        showNotification('Added to wishlist!', 'success');
    } else {
        showNotification('Already in wishlist.', 'info');
    }
}

// ✅ Remove from Wishlist
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistBadge();
    displayWishlist();
    showNotification('Removed from wishlist.', 'success');
}

// ✅ Show Wishlist Items in Modal
function displayWishlist() {
    const wishlistItems = document.getElementById('wishlistItems');
    if (!wishlistItems) return;

    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = `<p>Your wishlist is empty.</p>`;
        return;
    }

    wishlistItems.innerHTML = wishlist.map(id => {
        const product = products.find(p => p.id === id);
        if (!product) return '';
      return `
  <div class="wishlist-item">
    <img src="${product.image}" alt="${product.name}" />
    <div class="wishlist-item-info">
      <h4>${product.name}</h4>
      <p>₨ ${product.price.toLocaleString()}</p>
    </div>
    <button onclick="removeFromWishlist(${product.id})">Remove</button>
  </div>
`;
    }).join('');
}

// ✅ Update the wishlist icon badge
function updateWishlistBadge() {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    wishlist = wishlist.filter(id => products.some(p => p.id === id));
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.textContent = wishlist.length;
    }
}


// ✅ Initialize Events After DOM Load
document.addEventListener('DOMContentLoaded', function () {
    updateWishlistBadge();

    // Add to Wishlist Buttons
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.getAttribute('data-product-id'));
            addToWishlist(productId);
        });
    });

    // Wishlist Nav Button
    const wishlistNav = document.getElementById('wishlistNav');
    if (wishlistNav) {
        wishlistNav.addEventListener('click', () => {
            displayWishlist();
            openModal('wishlistModal');
        });
    }
});

// Modal Management
function initializeModals() {
    const modalCloses = document.querySelectorAll('.modal-close');
    const modals = document.querySelectorAll('.modal');

    modalCloses.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            const modalId = closeBtn.getAttribute('data-modal');
            closeModal(modalId);
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

// Authentication System
function initializeAuth() {
    const loginRegisterBtn = document.getElementById('loginRegisterBtn');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginRegisterBtn) {
        loginRegisterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                openModal('accountModal');
                displayAccountInfo();
            } else {
                openModal('loginModal');
            }
        });
    }

    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('loginModal');
            openModal('registerModal');
        });
    }

    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal('registerModal');
            openModal('loginModal');
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Get stored users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('loginModal');
        updateUI();
        showNotification('Login successful!', 'success');
        document.getElementById('loginForm').reset();
    } else {
        showNotification('Invalid email or password!', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        address,
        password,
        registeredAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    closeModal('registerModal');
    updateUI();
    showNotification('Registration successful!', 'success');
    document.getElementById('registerForm').reset();
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    closeModal('accountModal');
    updateUI();
    showNotification('Logged out successfully!', 'success');
}


function handleGoogleLogin(response) {
    const token = response.credential;
    const userData = parseJwt(token);

    // Store in the same format your app expects
    currentUser = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        phone: "N/A",
        address: "N/A",
        password: null,
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUI();
    showNotification('Logged in with Google!', 'success');
    closeModal('loginModal');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
function handleGoogleLogin(response) {
    const token = response.credential;
    const userData = parseJwt(token);

    currentUser = {
        id: userData.sub,
        name: userData.name,
        email: userData.email,
        phone: "N/A",
        address: "N/A",
        password: null,
        registeredAt: new Date().toISOString()
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    updateUI();
    closeModal('loginModal');
    showNotification('Logged in with Google!', 'success');
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    return JSON.parse(jsonPayload);
}

function loadUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
    }
}

function displayAccountInfo() {
    const accountInfo = document.getElementById('accountInfo');
    if (currentUser && accountInfo) {
        accountInfo.innerHTML = `
            <div class="account-field">
                <label>Name:</label>
                <span>${currentUser.name}</span>
            </div>
            <div class="account-field">
                <label>Email:</label>
                <span>${currentUser.email}</span>
            </div>
            <div class="account-field">
                <label>Phone:</label>
                <span>${currentUser.phone}</span>
            </div>
            <div class="account-field">
                <label>Address:</label>
                <span>${currentUser.address}</span>
            </div>
            <div class="account-field">
                <label>Member Since:</label>
                <span>${new Date(currentUser.registeredAt).toLocaleDateString()}</span>
            </div>
        `;
    }
}

// Cart System
function initializeCart() {
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    const cartNav = document.getElementById('cartNav');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const clearCartBtn = document.getElementById('clearCartBtn');

    

    if (cartNav) {
        cartNav.addEventListener('click', () => {
            openModal('cartModal');
            displayCart();
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
   const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
console.log("Add To Cart 6");
        cart.push(
            {
            ...product,
            quantity: 1
            
        });
   
    }

    saveCart();
    updateCartBadge();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartBadge();
    displayCart();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartBadge();
            displayCart();
        }
    }
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some products to get started!</p>
            </div>
        `;
        cartTotal.textContent = '0';
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="cart-item-price">₨ ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
    }).join('');

    cartTotal.textContent = total.toLocaleString();
}

function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    if (!currentUser) {
        closeModal('cartModal');
        openModal('loginModal');
        showNotification('Please login to checkout!', 'error');
        return;
    }

    // Simulate checkout
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Order placed successfully! Total: ₨ ${total.toLocaleString()}`, 'success');
    clearCart();
    closeModal('cartModal');
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartBadge();
    displayCart();
    showNotification('Cart cleared!', 'success');
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}
// Search System
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Add search suggestions
        searchInput.addEventListener('input', debounce(showSearchSuggestions, 300));
    }
}
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.productId);
        if (typeof addToCart === 'function') {
            console.log("add to cart 7");
          addToCart(id);
        } else {
            console.log("add to cart 8");
          alert('Cart functionality not available. Please check script.js');
        }
      });
    });

  

    // Load reviews
    document.querySelectorAll('.product-card').forEach(card => {
      const productId = parseInt(card.querySelector('.add-to-cart-btn')?.dataset.productId);
      if (!productId) return;

      const reviewContainer = document.createElement('div');
      reviewContainer.classList.add('review-display');
      card.appendChild(reviewContainer);

      const reviews = JSON.parse(localStorage.getItem("reviews") || "{}")[productId] || [];
      if (reviews.length > 0) {
        reviewContainer.innerHTML = '<h4>Reviews:</h4>' + reviews.map(r => `
          <div class="single-review">
            <strong>${r.user}</strong>: ${r.text}
          </div>
        `).join('');
      }
    });
  });

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        showNotification('Please enter a search term!', 'error');
        return;
    }

    const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
    );

    displaySearchResults(results, searchTerm);
    openModal('searchModal');
}

function displaySearchResults(results, searchTerm) {
    const searchResults = document.getElementById('searchResults');
    
    if (!searchResults) return;

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>Product not found</h3>
                <p>No products found for "${searchTerm}"</p>
                <p>Try searching with different keywords.</p>
            </div>
        `;
        return;
    }

    searchResults.innerHTML = `
        <h4>Found ${results.length} product(s) for "${searchTerm}"</h4>
        <div class="search-results-grid">
            ${results.map(product => `
                <div class="search-result-item">
                    <div class="search-result-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="search-result-info">
                        <h4>${product.name}</h4>
                        <div class="search-result-price">₨ ${product.price.toLocaleString()}</div>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function filterProducts(value, type) {
    let results = [];
    
    if (type === 'category') {
        if (value === 'all') {
            results = products;
        } else {
            results = products.filter(product => product.category === value);
        }
    } else if (type === 'brand') {
        results = products.filter(product => product.brand === value);
    }

    displaySearchResults(results, `${type}: ${value}`);
    openModal('searchModal');
}

function showSearchSuggestions(searchTerm) {
    // This could be implemented to show dropdown suggestions
    // For now, we'll keep it simple
}

// Navigation System
function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const accountNav = document.getElementById('accountNav');
    const homeNav = document.getElementById('homeNav');
    const wishlistNav = document.getElementById('wishlistNav');
    const reviewsNav = document.getElementById('reviewsNav');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    if (accountNav) {
        accountNav.addEventListener('click', () => {
            if (currentUser) {
                openModal('accountModal');
                displayAccountInfo();
            } else {
                openModal('loginModal');
            }
        });
    }

    if (homeNav) {
        homeNav.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// UI Updates
function updateUI() {
    const userStatus = document.getElementById('userStatus');
    
    if (userStatus) {
        if (currentUser) {
            userStatus.textContent = `Hello, ${currentUser.name}`;
        } else {
            userStatus.textContent = 'Login / Register';
        }
    }

    updateCartBadge();
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 4000;
                display: flex;
                align-items: center;
                gap: 10px;
                min-width: 300px;
                animation: slideIn 0.3s ease;
            }
            .notification-success { border-left: 4px solid #28a745; }
            .notification-error { border-left: 4px solid #dc3545; }
            .notification-info { border-left: 4px solid #17a2b8; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// CTA Button functionality
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.cta-btn');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const productsSection = document.querySelector('.product-section');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Make functions globally available for onclick handlers
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;

