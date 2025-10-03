// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#nav-menu');
const menuOverlay = document.querySelector('.menu-overlay');

menuToggle.addEventListener('click', function() {
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
});

menuOverlay.addEventListener('click', function() {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    menuOverlay.classList.remove('active');
});

// Cart functionality
const cartCount = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.shop-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
        const currentCount = parseInt(cartCount.textContent);
        cartCount.textContent = currentCount + 1;
        
        // Show notification
        showNotification('Product added to cart!', 'success');
    });
});

// Notification system
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Quick view functionality
const quickViewButtons = document.querySelectorAll('.quick-view-btn');

quickViewButtons.forEach(button => {
    button.addEventListener('click', function() {
        const productCard = this.closest('.product-card');
        const productName = productCard.querySelector('.product-name').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;
        
        showNotification(`Quick view: ${productName} - ${productPrice}`, 'info');
    });
});

// Featured product button
const featuredBtn = document.querySelector('.featured-btn');

featuredBtn.addEventListener('click', function() {
    showNotification('Viewing Mint Lounge Chair details', 'info');
});

// Explore button
const exploreBtn = document.querySelector('.explore-btn');

exploreBtn.addEventListener('click', function() {
    document.querySelector('.collection-section').scrollIntoView({ 
        behavior: 'smooth' 
    });
});