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

// Utility function for email validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Notification system
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

// Shopping Cart Module - Enhanced
const shoppingCartModule = (function() {
    let cart = [];
    
    function init() {
        // Load cart from localStorage
        loadCart();
        
        // Shop buttons
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('shop-btn')) {
                e.preventDefault();
                const card = e.target.closest('.product-card');
                const productId = card.getAttribute('data-id');
                const productName = card.getAttribute('data-name');
                const productPrice = card.getAttribute('data-price');
                
                addToCart({
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice),
                    quantity: 1
                });
            }
        });
        
        // Add to cart button in modal
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const modal = document.getElementById('quick-view-modal');
                const productId = modal.getAttribute('data-product-id');
                const productName = document.getElementById('modal-name').textContent;
                const productPrice = document.getElementById('modal-price').textContent.replace('$', '');
                const quantity = parseInt(document.getElementById('quantity').value);
                
                addToCart({
                    id: productId,
                    name: productName,
                    price: parseFloat(productPrice),
                    quantity: quantity
                });
                
                // Close modal
                modalModule.closeModal();
            });
        }
        
        // Cart icon click
        document.getElementById('cart-icon').addEventListener('click', openCartModal);
        
        // Checkout button
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('checkout-btn')) {
                openCheckoutModal();
            }
        });
        
        // Place order button
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
            }
        });
    }
    
    function addToCart(product) {
        // Check if product already in cart
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        // Save cart to localStorage
        saveCart();
        
        // Update cart count
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
    }
    
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        renderCart();
    }
    
    function updateQuantity(productId, quantity) {
        const item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity = parseInt(quantity);
            saveCart();
            renderCart();
        }
    }
    
    function updateCartCount() {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
    }
    
    function saveCart() {
        localStorage.setItem('artisanCart', JSON.stringify(cart));
    }
    
    function loadCart() {
        const savedCart = localStorage.getItem('artisanCart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartCount();
        }
    }
    
    function getTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function openCartModal() {
        renderCart();
        openModal('cart-modal');
        document.body.style.overflow = 'hidden';
    }
    
    function openCheckoutModal() {
        renderOrderSummary();
        openModal('checkout-modal');
        closeModal('cart-modal');
    }
    
    function renderCart() {
        const cartItems = document.querySelector('.cart-items');
        const cartEmpty = document.querySelector('.cart-empty');
        const cartTotal = document.querySelector('.cart-total-amount');
        
        if (cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
            cartTotal.textContent = '$0';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item" data-id="${item.id}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <input type="number" class="cart-quantity" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="remove-item" data-id="${item.id}"><i class="fa fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
            
            cartTotal.textContent = `$${getTotal().toFixed(2)}`;
            
            // Add event listeners to cart items
            document.querySelectorAll('.cart-quantity').forEach(input => {
                input.addEventListener('change', function() {
                    updateQuantity(this.getAttribute('data-id'), this.value);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    removeFromCart(this.getAttribute('data-id'));
                });
            });
        }
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
        
        orderTotal.textContent = `$${getTotal().toFixed(2)}`;
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
            total: getTotal()
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
    
    function clearCart() {
        cart = [];
        saveCart();
        updateCartCount();
        renderCart();
    }
    
    function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }
    
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = '';
    }
    
    return { 
        init, 
        openCartModal, 
        clearCart,
        getTotal,
        getCart: () => cart
    };
})();

// Search Module
const searchModule = (function() {
    function init() {
        const searchBtn = document.getElementById('search-btn');
        const searchInput = document.getElementById('search-input');
        const searchContainer = document.getElementById('search-container');
        
        // Toggle search on mobile
        searchBtn.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                searchContainer.classList.toggle('active');
                if (searchContainer.classList.contains('active')) {
                    searchInput.focus();
                }
            } else {
                performSearch();
            }
        });
        
        // Search on enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
            
            if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        
        if (searchTerm) {
            showNotification(`Searching for "${searchTerm}"...`, 'info');
        }
    }
    
    return { init };
})();

// Sort Module
const sortModule = (function() {
    function init() {
        const sortSelect = document.getElementById('sort-select');
        
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            const productGrid = document.getElementById('product-grid');
            const productCards = Array.from(productGrid.querySelectorAll('.product-card'));
            
            productCards.sort((a, b) => {
                switch(sortBy) {
                    case 'price-low':
                        return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
                    case 'price-high':
                        return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
                    case 'name':
                        return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
                    default:
                        return 0;
                }
            });
            
            // Re-append sorted cards
            productCards.forEach(card => productGrid.appendChild(card));
        });
    }
    
    return { init };
})();

// Lazy Loading Module
const lazyLoadModule = (function() {
    function init() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy-image');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('lazy-image');
            imageObserver.observe(img);
        });
    }
    
    return { init };
})();

// Menu Module - Updated with overlay
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
                // Handle on all mobile and tablet devices (changed from 576 to 768)
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Toggle current dropdown
                    container.classList.toggle('show-dropdown');
                    
                    // Update ARIA attributes
                    updateAriaAttributes(container);
                    
                    // Close other dropdowns
                    dropdownContainers.forEach(function(otherContainer) {
                        if (otherContainer !== container) {
                            otherContainer.classList.remove('show-dropdown');
                            updateAriaAttributes(otherContainer);
                        }
                    });
                }
            });
        });
        
        // Close mobile menu when clicking overlay
        menuOverlay.addEventListener('click', closeMenu);
        
        // Handle window resize
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // Handle touch gestures
        initTouchGestures();
        
        // Prevent body scroll when mobile menu is open
        observeMenuState();
    }
    
    function updateAriaAttributes(container) {
        const toggle = container.querySelector('.dropdown-toggle');
        const isExpanded = container.classList.contains('show-dropdown');
        toggle.setAttribute('aria-expanded', isExpanded);
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
                updateAriaAttributes(container);
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
            updateAriaAttributes(container);
        });
    }
    
    function handleResize() {
        if (window.innerWidth > 768) {
            // Reset mobile menu state
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            menuOverlay.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            dropdownContainers.forEach(container => {
                container.classList.remove('show-dropdown');
                updateAriaAttributes(container);
            });
        }
    }
    
    function initTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        });
        
        function handleSwipeGesture() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Horizontal swipe for menu
            if (Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0 && touchStartX < 100) {
                    // Swipe right from left edge - open menu
                    navMenu.classList.add('active');
                    mobileMenuBtn.classList.add('active');
                    menuOverlay.classList.add('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'true');
                } else if (diffX < 0 && navMenu.classList.contains('active')) {
                    // Swipe left - close menu
                    closeMenu();
                }
            }
            
            // Vertical swipe for closing menu
            if (Math.abs(diffY) > swipeThreshold && navMenu.classList.contains('active')) {
                if (diffY < 0 && touchStartY < 100) {
                    // Swipe down from top - close menu
                    closeMenu();
                }
            }
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

// Scroll Animations Module
const scrollAnimationsModule = (function() {
    function init() {
        // Intersection Observer for fade-in animation
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(handleIntersection, observerOptions);
        
        // Observe elements for animation
        const elementsToObserve = [
            '.text-content',
            '.image-content',
            '.stats-container',
            '.elevate-content',
            '.elevate-image',
            '.about-content',
            '.about-image',
            '.section-header',
            '.testimonial-featured',
            '.testimonial-small',
            '.newsletter-content',
            '.footer-content',
            '.product-card'
        ];
        
        elementsToObserve.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                // Set initial state
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(element);
            });
        });
    }
    
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Start counting animation for stats when visible
                if (entry.target.classList.contains('stats-container')) {
                    statsModule.startCounting();
                    entry.target.classList.add('visible');
                }
            } else {
                // Reset opacity and transform when not visible
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                // Reset stats when not visible
                if (entry.target.classList.contains('stats-container')) {
                    statsModule.resetStats();
                    entry.target.classList.remove('visible');
                }
            }
        });
    }
    
    return { init };
})();

// Statistics Module
const statsModule = (function() {
    let countingIntervals = [];
    
    function startCounting() {
        // Clear any existing intervals
        countingIntervals.forEach(interval => clearInterval(interval));
        countingIntervals = [];
        
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach((stat, index) => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // 2 seconds for the animation
            const increment = target / (duration / 20); // Update every 20ms
            let current = 0;
            
            // Reset to 0 before starting
            stat.textContent = '0';
            stat.classList.add('counting');
            
            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    
                    const interval = setTimeout(updateCount, 20);
                    countingIntervals.push(interval);
                } else {
                    stat.textContent = target;
                    stat.classList.remove('counting');
                }
            };
            
            // Start counting with a slight delay for each stat
            setTimeout(() => {
                updateCount();
            }, index * 100); // 100ms delay between each stat
        });
    }
    
    function resetStats() {
        // Clear all counting intervals
        countingIntervals.forEach(interval => clearInterval(interval));
        countingIntervals = [];
        
        // Reset all stats to 0
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            stat.textContent = '0';
            stat.classList.remove('counting');
        });
    }
    
    // Check if stats container is already visible on page load
    function checkInitialVisibility() {
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            const statsRect = statsContainer.getBoundingClientRect();
            const isVisible = (
                statsRect.top >= 0 &&
                statsRect.left >= 0 &&
                statsRect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                statsRect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
            
            if (isVisible) {
                statsContainer.style.opacity = '1';
                statsContainer.style.transform = 'translateY(0)';
                statsContainer.classList.add('visible');
                startCounting();
            }
        }
    }
    
    return { startCounting, resetStats, checkInitialVisibility };
})();

// Product Filter Module
const productFilterModule = (function() {
    function init() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter products
                productCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        // Add animation
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    return { init };
})();

// Modal Module
const modalModule = (function() {
    const modal = document.getElementById('quick-view-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    
    function init() {
        // Quick view buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.quick-view-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.quick-view-btn');
                const card = btn.closest('.product-card');
                openModal(card);
            }
        });
        
        // Close modal
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-modal')) {
                closeModal();
            }
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (modal.style.display === 'block') {
                        modal.style.display = 'none';
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }
    
    function openModal(card) {
        const image = card.querySelector('.product-image').src;
        const name = card.getAttribute('data-name');
        const description = card.querySelector('.product-description').textContent;
        const price = card.getAttribute('data-price');
        const productId = card.getAttribute('data-id');
        
        // Populate modal with product info
        document.getElementById('modal-image').src = image;
        document.getElementById('modal-name').textContent = name;
        document.getElementById('modal-description').textContent = description;
        document.getElementById('modal-price').textContent = '$' + price;
        modal.setAttribute('data-product-id', productId);
        
        // Show modal
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent body scroll
        
        // Focus management for accessibility
        document.querySelector('.close-modal').focus();
    }
    
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scroll
        
        // Reset quantity
        document.getElementById('quantity').value = 1;
    }
    
    return { init, closeModal };
})();

// Button Interactions Module
const buttonInteractionsModule = (function() {
    function init() {
        // General button interactions
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn')) {
                // Add click feedback animation
                e.target.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    e.target.style.transform = '';
                }, 150);
                
                // Handle specific button actions
                handleButtonAction(e.target);
            }
        });
    }
    
    function handleButtonAction(button) {
        const buttonText = button.textContent.trim();
        
        // Log button click (ready for actual navigation)
        console.log(`Button clicked: ${buttonText}`);
        
        // Handle specific button types
        if (button.classList.contains('explore-btn')) {
            showNotification('Exploring collection...', 'info');
            const collectionSection = document.getElementById('collection');
            if (collectionSection) {
                collectionSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (buttonText === 'Shop Now' && button.closest('.elevate-buttons')) {
            showNotification('Redirecting to shop...', 'info');
        } else if (buttonText === 'Learn More' && button.closest('.elevate-buttons')) {
            showNotification('Loading more information...', 'info');
        } else if (buttonText === 'Read Our Story') {
            showNotification('Loading our story...', 'info');
        } else if (buttonText === 'Browse the Collection' && button.closest('.testimonials-button')) {
            const collectionSection = document.getElementById('collection');
            if (collectionSection) {
                collectionSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }
    
    return { init };
})();

// Newsletter Module
const newsletterModule = (function() {
    function init() {
        const newsletterForm = document.querySelector('.newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                // Validate email
                if (!validateEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    emailInput.focus();
                    return;
                }
                
                // Show notification
                showNotification(`Thank you for subscribing with ${email}!`);
                
                // Reset form
                this.reset();
                
                // In a real application, you would send the email to your server
                // fetch('/api/subscribe', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({ email: email })
                // })
                // .then(response => response.json())
                // .then(data => console.log(data))
                // .catch(error => console.error(error));
            });
        }
    }
    
    return { init };
})();

// Parallax Effect Module
const parallaxModule = (function() {
    function init() {
        const imageContent = document.querySelector('.image-content');
        const productImage = document.querySelector('.product-image');
        
        if (imageContent && productImage) {
            imageContent.addEventListener('mousemove', (e) => {
                const rect = imageContent.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                productImage.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
            
            imageContent.addEventListener('mouseleave', () => {
                productImage.style.transform = '';
            });
        }
    }
    
    return { init };
})();

// Smooth Scroll Module
const smoothScrollModule = (function() {
    function init() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    return { init };
})();

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    menuModule.init();
    scrollAnimationsModule.init();
    statsModule.checkInitialVisibility();
    productFilterModule.init();
    modalModule.init();
    shoppingCartModule.init();
    buttonInteractionsModule.init();
    newsletterModule.init();
    parallaxModule.init();
    smoothScrollModule.init();
    searchModule.init();
    sortModule.init();
    lazyLoadModule.init();
    
    // Start counting immediately when page loads
    setTimeout(() => {
        statsModule.startCounting();
    }, 500);
});