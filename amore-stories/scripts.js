/* ============================================
   AMORE STORIES - SCRIPTS.JS
   Wedding Photography Website
   ============================================ */

// ============================================
// DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initNavbarScroll();
    initInstagramFeed();
    initCookieConsent();
    initBackToTop();
    initContactForm();
    initGalleryHover();
});

// ============================================
// Mobile Menu Toggle
// ============================================
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnToggle = mobileToggle.contains(event.target);
        const isMenuOpen = navMenu.classList.contains('active');
        
        if (isMenuOpen && !isClickInsideMenu && !isClickOnToggle) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && navMenu.classList.contains('active')) {
            mobileToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            mobileToggle.focus();
        }
    });
}

// ============================================
// Smooth Scroll Navigation
// ============================================
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetId = href.slice(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate navbar height
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update focus for accessibility
                setTimeout(() => {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }, 500);
            }
        });
    });
}

// ============================================
// Navbar Scroll Effect
// ============================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0;
    
    // Add shadow on scroll
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
}

// ============================================
// Instagram Feed Integration
// ============================================
function initInstagramFeed() {
    const instagramGrid = document.getElementById('instagramGrid');
    
    // Placeholder Instagram images (from Unsplash)
    const instagramImages = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
        'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
        'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80',
        'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80',
        'https://images.unsplash.com/photo-1621621667790-e832c1b5a0f1?w=600&q=80',
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=600&q=80',
        'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80'
    ];
    
    // Create Instagram grid items
    instagramImages.forEach((imageUrl, index) => {
        const item = document.createElement('div');
        item.className = 'instagram-item';
        item.setAttribute('role', 'img');
        item.setAttribute('aria-label', `Instagram photo ${index + 1}`);
        
        item.innerHTML = `
            <img src="${imageUrl}" alt="Instagram photo ${index + 1}" class="instagram-img" loading="lazy">
            <div class="instagram-overlay">
                <span class="instagram-icon">❤️</span>
            </div>
        `;
        
        // Add click to open in new tab (simulated)
        item.addEventListener('click', function() {
            window.open('https://instagram.com/amorestories', '_blank');
        });
        
        // Stagger animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        
        instagramGrid.appendChild(item);
        
        // Trigger animation
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100);
    });
}

// ============================================
// Cookie Consent Banner
// ============================================
function initCookieConsent() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptButton = document.getElementById('cookieAccept');
    const declineButton = document.getElementById('cookieDecline');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    if (!cookieChoice) {
        // Show banner after a short delay
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    }
    
    // Handle accept
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieBanner.classList.remove('visible');
        
        // Here you would initialize analytics/cookies
        console.log('Cookie consent: Accepted');
    });
    
    // Handle decline
    declineButton.addEventListener('click', function() {
        localStorage.setItem('cookieConsent', 'declined');
        cookieBanner.classList.remove('visible');
        
        console.log('Cookie consent: Declined');
    });
}

// ============================================
// Back to Top Button
// ============================================
function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > 500) {
            backToTopButton.classList.add('visible');
            backToTopButton.setAttribute('tabindex', '0');
        } else {
            backToTopButton.classList.remove('visible');
            backToTopButton.setAttribute('tabindex', '-1');
        }
    });
    
    // Scroll to top on click
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Focus on first heading for accessibility
        setTimeout(() => {
            document.querySelector('.hero-title').focus();
        }, 500);
    });
    
    // Keyboard support
    backToTopButton.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// ============================================
// Contact Form Handling
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        const requiredFields = ['firstName', 'lastName', 'email', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            const input = contactForm.querySelector(`[name="${field}"]`);
            if (!data[field] || !data[field].trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
                
                // Remove error on input
                input.addEventListener('input', function() {
                    this.style.borderColor = '';
                }, { once: true });
            }
        });
        
        // Validate email format
        const emailInput = contactForm.querySelector('[name="email"]');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (data.email && !emailRegex.test(data.email)) {
            isValid = false;
            emailInput.style.borderColor = '#e74c3c';
            
            emailInput.addEventListener('input', function() {
                this.style.borderColor = '';
            }, { once: true });
        }
        
        if (!isValid) {
            // Show error message
            showNotification('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Simulate form submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Success
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Show success message
            showNotification('Thank you for your message! We\'ll be in touch soon.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Log form data (in production, send to server)
            console.log('Form submitted:', data);
        }, 1500);
    });
}

// ============================================
// Notification System
// ============================================
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#27ae60' : '#e74c3c',
        color: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '9999',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '350px',
        fontSize: '14px',
        lineHeight: '1.5'
    });
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add animation keyframes
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(styleSheet);

// ============================================
// Gallery Hover Effects
// ============================================
function initGalleryHover() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    
    galleryCards.forEach(card => {
        const image = card.querySelector('.gallery-img');
        const overlay = card.querySelector('.gallery-overlay');
        
        card.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });
}

// ============================================
// Intersection Observer for Animations
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.section-header, .about-grid, .gallery-card, .testimonial, .contact-grid');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Add animate-in styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// Initialize scroll animations after a short delay
setTimeout(initScrollAnimations, 500);

// ============================================
// Lazy Loading Images
// ============================================
function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        lazyImages.forEach(img => {
            img.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
initLazyLoading();

// ============================================
// Console Message
// ============================================
console.log('%c Amore Stories ', 'background: #8B7355; color: #fff; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
console.log('%c Wedding Photography Website ', 'color: #8B7355; font-size: 12px;');
console.log('%c Built with ❤️ for beautiful moments ', 'color: #666; font-size: 11px;');

// ============================================
// Performance Optimization
// ============================================
// Debounce function for performance
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

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Apply throttle to scroll events
const scrollHandler = throttle(() => {
    // Scroll-related logic
}, 100);

window.addEventListener('scroll', scrollHandler);

// ============================================
// Service Worker Registration (PWA support)
// ============================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // In production, register service worker here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// ============================================
// Print Styles
// ============================================
window.addEventListener('beforeprint', function() {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', function() {
    document.body.classList.remove('printing');
});