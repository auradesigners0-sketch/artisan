document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    
    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        navMenu.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        
        // Close all dropdowns when closing menu
        if (!navMenu.classList.contains('active')) {
            dropdownContainers.forEach(container => {
                container.classList.remove('show-dropdown');
            });
        }
    });
    
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
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.menu-bar') && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            dropdownContainers.forEach(container => {
                container.classList.remove('show-dropdown');
            });
        }
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 576) {
                // Reset mobile menu state
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                dropdownContainers.forEach(container => {
                    container.classList.remove('show-dropdown');
                });
            }
        }, 250);
    });
    
    // Featured section button interactions
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Log button click (ready for actual navigation)
            console.log(`Button clicked: ${this.textContent}`);
            
            // Add click feedback animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Intersection Observer for fade-in animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Start counting animation for stats when visible
                if (entry.target.classList.contains('stats-container')) {
                    startCounting();
                    entry.target.classList.add('visible');
                }
            } else {
                // Reset opacity and transform when not visible
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                
                // Reset stats when not visible
                if (entry.target.classList.contains('stats-container')) {
                    resetStats();
                    entry.target.classList.remove('visible');
                }
            }
        });
    }, observerOptions);
    
    // Animate text content on scroll
    const textContent = document.querySelector('.text-content');
    textContent.style.opacity = '0';
    textContent.style.transform = 'translateY(30px)';
    textContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    // Animate image on scroll
    const imageContent = document.querySelector('.image-content');
    imageContent.style.opacity = '0';
    imageContent.style.transform = 'translateY(30px)';
    imageContent.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';
    
    // Animate stats container on scroll
    const statsContainer = document.querySelector('.stats-container');
    statsContainer.style.opacity = '0';
    statsContainer.style.transform = 'translateY(30px)';
    statsContainer.style.transition = 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s';
    
    observer.observe(textContent);
    observer.observe(imageContent);
    observer.observe(statsContainer);
    
    // Add parallax effect to image on mouse move (subtle effect)
    const productImage = document.querySelector('.product-image');
    
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
    
    // Counting animation for statistics
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
    
    // Start counting immediately when page loads
    setTimeout(() => {
        startCounting();
    }, 500); // Small delay to ensure everything is loaded
    
    // Also check if stats container is already visible on page load
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
    
    // Collection section functionality
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
    
    // Quick view modal
    const modal = document.getElementById('quick-view-modal');
    const closeModal = document.querySelector('.close-modal');
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const image = card.querySelector('.product-image').src;
            const name = card.querySelector('.product-name').textContent;
            const description = card.querySelector('.product-description').textContent;
            const price = card.querySelector('.product-price').textContent;
            
            // Populate modal with product info
            document.getElementById('modal-image').src = image;
            document.getElementById('modal-name').textContent = name;
            document.getElementById('modal-description').textContent = description;
            document.getElementById('modal-price').textContent = price;
            
            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent body scroll
        });
    });
    
    // Close modal
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scroll
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore body scroll
        }
    });
    
    // Shop button functionality
    const shopBtns = document.querySelectorAll('.shop-btn');
    
    shopBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.product-card');
            const name = card.querySelector('.product-name').textContent;
            
            // Show notification
            showNotification(`${name} added to cart!`);
        });
    });
    
    // Add to cart button in modal
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    addToCartBtn.addEventListener('click', function() {
        const name = document.getElementById('modal-name').textContent;
        const quantity = document.getElementById('quantity').value;
        
        // Show notification
        showNotification(`${quantity} × ${name} added to cart!`);
        
        // Close modal
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scroll
        
        // Reset quantity
        document.getElementById('quantity').value = 1;
    });
    
    // Elevate section button interactions
    const elevateButtons = document.querySelectorAll('.elevate-buttons .btn');

    elevateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Log button click (ready for actual navigation)
            console.log(`Elevate section button clicked: ${this.textContent}`);
            
            // Add click feedback animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Show notification
            if (this.textContent === 'Shop Now') {
                showNotification('Redirecting to shop...');
                // In a real application, you would navigate to the shop page
                // window.location.href = '/shop';
            } else if (this.textContent === 'Learn More') {
                showNotification('Loading more information...');
                // In a real application, you would navigate to the about page
                // window.location.href = '/about';
            }
        });
    });
    
    // Add animation to elevate section on scroll
    const elevateContent = document.querySelector('.elevate-content');
    const elevateImage = document.querySelector('.elevate-image');

    // Set initial state for animation
    elevateContent.style.opacity = '0';
    elevateContent.style.transform = 'translateY(30px)';
    elevateContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    elevateImage.style.opacity = '0';
    elevateImage.style.transform = 'translateY(30px)';
    elevateImage.style.transition = 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s';

    // Observe elevate section for animation
    const elevateObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elevateObserver.observe(elevateContent);
    elevateObserver.observe(elevateImage);
    
    // Notification function
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#2c3e50';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        notification.style.zIndex = '10000';
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Add animation to product cards on scroll
    const productObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    // Observe product cards
    productCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        productObserver.observe(card);
    });
    
    // Handle touch events for better mobile experience
    let touchStartY = 0;
    let touchEndY = 0;
    
    navMenu.addEventListener('touchstart', function(e) {
        touchStartY = e.changedTouches[0].screenY;
    });
    
    navMenu.addEventListener('touchend', function(e) {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && touchStartY < 100) {
                // Swipe down from top - close menu
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    }
    
    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll() {
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
    
    // Update body scroll on menu toggle
    const bodyScrollObserver = new MutationObserver(toggleBodyScroll);
    bodyScrollObserver.observe(navMenu, { attributes: true, attributeFilter: ['class'] });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});