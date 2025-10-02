// Cart Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart functionality
    const cartModule = (function() {
        let cart = [];
        
        function init() {
            // Load cart from localStorage
            loadCart();
            
            // Render cart items
            renderCart();
            
            // Update order summary
            updateOrderSummary();
            
            // Event listeners
            setupEventListeners();
        }
        
        function setupEventListeners() {
            // Clear cart button
            document.getElementById('clear-cart-btn').addEventListener('click', clearCart);
            
            // Checkout button
            document.getElementById('checkout-btn').addEventListener('click', openCheckoutModal);
            
            // Apply promo code
            document.getElementById('apply-promo-btn').addEventListener('click', applyPromoCode);
            
            // Close modal buttons
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('close-modal')) {
                    closeModal(e.target.closest('.modal').id);
                }
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target.classList.contains('modal')) {
                    closeModal(e.target.id);
                }
            });
            
            // Place order form
            document.addEventListener('submit', function(e) {
                if (e.target.classList.contains('customer-info-form')) {
                    e.preventDefault();
                    placeOrder(e.target);
                }
            });
            
            // Close confirmation button
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('close-confirmation-btn')) {
                    closeModal('confirmation-modal');
                    clearCart();
                    window.location.href = 'index.html';
                }
            });
        }
        
        function loadCart() {
            const savedCart = localStorage.getItem('artisanCart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
            }
            updateCartCount();
        }
        
        function saveCart() {
            localStorage.setItem('artisanCart', JSON.stringify(cart));
            updateCartCount();
        }
        
        function updateCartCount() {
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            document.getElementById('cart-count').textContent = count;
        }
        
        function renderCart() {
            const container = document.getElementById('cart-items-container');
            const emptyState = document.getElementById('cart-empty');
            
            if (cart.length === 0) {
                container.style.display = 'none';
                emptyState.style.display = 'block';
            } else {
                container.style.display = 'block';
                emptyState.style.display = 'none';
                
                container.innerHTML = cart.map(item => `
                    <div class="cart-item-page" data-id="${item.id}">
                        <div class="cart-item-image">
                            <img src="images/${getProductImage(item.name)}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h3 class="cart-item-name">${item.name}</h3>
                            <p class="cart-item-description">${item.description || 'Handcrafted with care and attention to detail.'}</p>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease-quantity" data-id="${item.id}">
                                    <i class="fa fa-minus"></i>
                                </button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                                <button class="quantity-btn increase-quantity" data-id="${item.id}">
                                    <i class="fa fa-plus"></i>
                                </button>
                            </div>
                            <button class="remove-item-btn" data-id="${item.id}">
                                <i class="fa fa-trash"></i> Remove
                            </button>
                        </div>
                    </div>
                `).join('');
                
                // Add event listeners to quantity buttons
                document.querySelectorAll('.decrease-quantity').forEach(btn => {
                    btn.addEventListener('click', function() {
                        updateQuantity(this.getAttribute('data-id'), -1);
                    });
                });
                
                document.querySelectorAll('.increase-quantity').forEach(btn => {
                    btn.addEventListener('click', function() {
                        updateQuantity(this.getAttribute('data-id'), 1);
                    });
                });
                
                document.querySelectorAll('.quantity-input').forEach(input => {
                    input.addEventListener('change', function() {
                        const newQuantity = parseInt(this.value);
                        if (newQuantity > 0) {
                            setQuantity(this.getAttribute('data-id'), newQuantity);
                        }
                    });
                });
                
                document.querySelectorAll('.remove-item-btn').forEach(btn => {
                    btn.addEventListener('click', function() {
                        removeItem(this.getAttribute('data-id'));
                    });
                });
            }
        }
        
        function getProductImage(productName) {
            // Map product names to image files
            const imageMap = {
                'Handcrafted Ceramic Vase': 'handmade-vase.png',
                'Brass Table Lamp': 'table-lamp.png',
                'Linen Throw Pillows': 'throw-pillow.png',
                'Carved Wooden Stool': 'wooden-stool.png',
                'Art Glass Vase': 'glass-vase.png',
                'Woven Pendant Light': 'pendant-light.png',
                'Merino Wool Throw': 'throw-blanket.png',
                'Marble Side Table': 'side-table.png'
            };
            return imageMap[productName] || 'placeholder.png';
        }
        
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeItem(productId);
                } else {
                    saveCart();
                    renderCart();
                    updateOrderSummary();
                }
            }
        }
        
        function setQuantity(productId, quantity) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = quantity;
                saveCart();
                renderCart();
                updateOrderSummary();
            }
        }
        
        function removeItem(productId) {
            cart = cart.filter(item => item.id !== productId);
            saveCart();
            renderCart();
            updateOrderSummary();
            showNotification('Item removed from cart');
        }
        
        function clearCart() {
            if (cart.length > 0 && confirm('Are you sure you want to clear your cart?')) {
                cart = [];
                saveCart();
                renderCart();
                updateOrderSummary();
                showNotification('Cart cleared');
            }
        }
        
        function updateOrderSummary() {
            const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            const shipping = subtotal > 100 ? 0 : 15;
            const tax = subtotal * 0.08; // 8% tax
            const total = subtotal + shipping + tax;
            
            document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
            document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
            document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
            document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
        }
        
        function applyPromoCode() {
            const promoCode = document.getElementById('promo-code').value.trim();
            if (promoCode) {
                // Simple promo code logic (in real app, validate against server)
                if (promoCode.toUpperCase() === 'ARTISAN10') {
                    showNotification('Promo code applied! 10% discount', 'success');
                    // Apply discount logic here
                } else {
                    showNotification('Invalid promo code', 'error');
                }
            }
        }
        
        function openCheckoutModal() {
            if (cart.length === 0) {
                showNotification('Your cart is empty', 'error');
                return;
            }
            
            renderOrderSummary();
            openModal('checkout-modal');
        }
        
        function renderOrderSummary() {
            const orderItems = document.querySelector('.order-items');
            const orderTotal = document.querySelector('.order-total-amount');
            
            orderItems.innerHTML = cart.map(item => `
                <div class="order-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('');
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            orderTotal.textContent = `$${total.toFixed(2)}`;
        }
        
        function placeOrder(form) {
            // Get form data
            const formData = {
                name: document.getElementById('customer-name').value,
                email: document.getElementById('customer-email').value,
                phone: document.getElementById('customer-phone').value,
                address: document.getElementById('customer-address').value,
                notes: document.getElementById('customer-notes').value,
                items: cart,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
            };
            
            // Generate order number
            const orderNumber = '#' + Math.floor(Math.random() * 100000);
            
            // Show confirmation
            showConfirmation(orderNumber);
            
            // Log order (in a real app, send to server)
            console.log('Order placed:', formData);
            
            // Close checkout modal
            closeModal('checkout-modal');
        }
        
        function showConfirmation(orderNumber) {
            document.querySelector('.order-number').textContent = orderNumber;
            openModal('confirmation-modal');
        }
        
        function openModal(modalId) {
            document.getElementById(modalId).style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
            document.body.style.overflow = '';
        }
        
        function showNotification(message, type = 'success') {
            // Remove existing notification if any
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                document.body.removeChild(existingNotification);
            }
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            
            // Add to page
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }
        
        return { init };
    })();
    
    // Initialize cart module
    cartModule.init();
    
    // Mobile menu functionality (reuse from main site)
    const menuModule = (function() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navMenu = document.getElementById('nav-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const dropdownContainers = document.querySelectorAll('.dropdown-container');
        
        function init() {
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', toggleMenu);
            
            // Handle dropdown on mobile
            dropdownContainers.forEach(function(container) {
                const dropdownToggle = container.querySelector('.dropdown-toggle');
                
                dropdownToggle.addEventListener('click', function(e) {
                    // Only handle on mobile screens
                    if (window.innerWidth <= 576) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Toggle current dropdown
                        container.classList.toggle('show-dropdown');
                        
                        // Close other dropdowns
                        dropdownContainers.forEach(function(otherContainer) {
                            if (otherContainer !== container) {
                                otherContainer.classList.remove('show-dropdown');
                            }
                        });
                    }
                });
            });
            
            // Close mobile menu when clicking overlay
            menuOverlay.addEventListener('click', closeMenu);
            
            // Handle window resize
            window.addEventListener('resize', debounce(handleResize, 250));
            
            // Prevent body scroll when mobile menu is open
            observeMenuState();
        }
        
        function toggleMenu() {
            const isActive = navMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            menuOverlay.classList.toggle('active');
            
            // Update ARIA expanded state
            mobileMenuBtn.setAttribute('aria-expanded', isActive);
            
            // Close all dropdowns when closing menu
            if (!isActive) {
                dropdownContainers.forEach(container => {
                    container.classList.remove('show-dropdown');
                });
            }
        }
        
        function closeMenu() {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            menuOverlay.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            dropdownContainers.forEach(container => {
                container.classList.remove('show-dropdown');
            });
        }
        
        function handleResize() {
            if (window.innerWidth > 576) {
                // Reset mobile menu state
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                menuOverlay.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                dropdownContainers.forEach(container => {
                    container.classList.remove('show-dropdown');
                });
            }
        }
        
        function observeMenuState() {
            const bodyScrollObserver = new MutationObserver(toggleBodyScroll);
            bodyScrollObserver.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
        }
        
        function toggleBodyScroll() {
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
        
        return { init };
    })();
    
    // Initialize menu module
    menuModule.init();
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
});