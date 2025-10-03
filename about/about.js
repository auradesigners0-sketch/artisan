document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        
        // Update ARIA attributes
        const expanded = this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true';
        this.setAttribute('aria-expanded', expanded);
    });
    
    menuOverlay.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
    });
    
    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const menuBar = document.querySelector('.menu-bar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            menuBar.style.padding = '15px 20px';
            menuBar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            menuBar.style.padding = '20px 40px';
            menuBar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });
    
    // Cart functionality (basic)
    const cartIcon = document.getElementById('cart-icon');
    const cartCount = document.getElementById('cart-count');
    
    // This would typically be connected to a backend or local storage
    // For demo purposes, we'll just simulate adding items
    let cartItems = 0;
    
    // Example: Add to cart buttons (would need to be added to product pages)
    // const addToCartButtons = document.querySelectorAll('.add-to-cart');
    // addToCartButtons.forEach(button => {
    //     button.addEventListener('click', function() {
    //         cartItems++;
    //         cartCount.textContent = cartItems;
    //         cartCount.style.display = 'flex';
    //         
    //         // Animation for cart icon
    //         cartIcon.classList.add('animate');
    //         setTimeout(() => {
    //             cartIcon.classList.remove('animate');
    //         }, 500);
    //     });
    // });
    
    // Parallax effect for hero section
    const heroBg = document.querySelector('.hero-bg');
    const heroContent = document.querySelector('.hero-content');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        if (heroBg && heroContent) {
            heroBg.style.transform = `translateY(${scrollY * 0.5}px)`;
            heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - scrollY / 700;
        }
    });
    
    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function animateTimeline() {
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight * 0.8) {
                setTimeout(() => {
                    item.style.opacity = 1;
                    item.style.transform = 'translateX(0)';
                }, index * 200);
            }
        });
    }
    
    // Initial timeline setup
    timelineItems.forEach(item => {
        item.style.opacity = 0;
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run on scroll
    window.addEventListener('scroll', animateTimeline);
    
    // Run once on load
    animateTimeline();
    
    // Team member hover effect
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.querySelector('.member-info').style.transform = 'translateY(0)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.querySelector('.member-info').style.transform = 'translateY(100%)';
        });
    });
    
    // Animated Counter for Mission Section
    const missionSection = document.querySelector('.mission-section');
    const showcaseNumbers = document.querySelectorAll('.showcase-number');
    let countersAnimated = false;
    
    function animateCounters() {
        if (countersAnimated) return;
        
        const sectionTop = missionSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.8) {
            countersAnimated = true;
            
            showcaseNumbers.forEach(counter => {
                const target = parseInt(counter.innerText.replace('+', ''));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target + '+';
                    }
                };
                
                updateCounter();
            });
        }
    }
    
    // Run on scroll
    window.addEventListener('scroll', animateCounters);
    
    // Run once on load
    animateCounters();
    
    // Form validation (if contact form is added)
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formFields = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            formFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('error');
                    isValid = false;
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show success message
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Thank you for your message! We\'ll get back to you soon.';
                
                this.appendChild(successMessage);
                this.reset();
                
                setTimeout(() => {
                    successMessage.remove();
                }, 5000);
            }
        });
    }
    
    // Newsletter subscription (if newsletter form is added)
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                emailInput.classList.add('error');
                return;
            }
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'Thank you for subscribing to our newsletter!';
            
            this.appendChild(successMessage);
            this.reset();
            
            setTimeout(() => {
                successMessage.remove();
            }, 5000);
        });
    }
    
    // Lazy loading for images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
    
    // Glitch effect for hero title
    const heroGlitch = document.querySelector('.hero-glitch');
    
    if (heroGlitch) {
        setInterval(() => {
            heroGlitch.style.animation = 'glitch 0.3s';
            
            setTimeout(() => {
                heroGlitch.style.animation = '';
            }, 300);
        }, 5000);
    }
    
    // Add CSS for glitch animation
    const glitchStyle = document.createElement('style');
    glitchStyle.textContent = `
        @keyframes glitch {
            0% {
                text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                            -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
            }
            14% {
                text-shadow: 0.05em 0 0 rgba(255, 0, 0, 0.75),
                            -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
                            0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
            }
            15% {
                text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                            0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                            -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
            }
            49% {
                text-shadow: -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
                            0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
                            -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
            }
            50% {
                text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                            0.05em 0 0 rgba(0, 255, 0, 0.75),
                            0 -0.05em 0 rgba(0, 0, 255, 0.75);
            }
            99% {
                text-shadow: 0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
                            0.05em 0 0 rgba(0, 255, 0, 0.75),
                            0 -0.05em 0 rgba(0, 0, 255, 0.75);
            }
            100% {
                text-shadow: -0.025em 0 0 rgba(255, 0, 0, 0.75),
                            -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
                            -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
            }
        }
        
        .cart-icon.animate {
            animation: cartBounce 0.5s ease;
        }
        
        @keyframes cartBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        .error {
            border-color: #ff6b6b !important;
        }
        
        .success-message {
            background-color: #4caf50;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            margin-top: 15px;
            text-align: center;
        }
    `;
    
    document.head.appendChild(glitchStyle);
});