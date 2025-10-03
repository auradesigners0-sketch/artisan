// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
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
    
    // Scroll animations for about sections
    const scrollAnimationsModule = (function() {
        function init() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(handleIntersection, observerOptions);
            
            // Observe all about sections
            document.querySelectorAll('.about-section').forEach(section => {
                // Set initial state
                section.style.opacity = '0';
                section.style.transform = 'translateY(30px)';
                section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                observer.observe(section);
            });
        }
        
        function handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('visible');
                }
            });
        }
        
        return { init };
    })();
    
    // Parallax effect for hero section
    const parallaxModule = (function() {
        function init() {
            window.addEventListener('scroll', handleScroll);
        }
        
        function handleScroll() {
            const scrolled = window.pageYOffset;
            const heroContent = document.querySelector('.hero-content');
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - scrolled / 600;
            }
        }
        
        return { init };
    })();
    
    // Smooth scroll for anchor links
    const smoothScrollModule = (function() {
        function init() {
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
    });
    
    // Load cart count from localStorage
    function loadCartCount() {
        const savedCart = localStorage.getItem('artisanCart');
        if (savedCart) {
            const cart = JSON.parse(savedCart);
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = count;
            }
        }
    }
    
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
    
    // Initialize all modules
    menuModule.init();
    scrollAnimationsModule.init();
    parallaxModule.init();
    smoothScrollModule.init();
    loadCartCount();
});