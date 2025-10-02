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
            '.value-item',
            '.timeline-item',
            '.team-member',
            '.process-step'
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
            } else {
                // Reset opacity and transform when not visible
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
            }
        });
    }
    
    return { init };
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
        if (buttonText === 'Book a Visit') {
            // This would typically open a booking form or modal
            alert('Booking form would open here');
        }
    }
    
    return { init };
})();

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize modules
    menuModule.init();
    scrollAnimationsModule.init();
    buttonInteractionsModule.init();
});