// Utility Functions
const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Intersection Observer for Sections
// This observer will watch each <section> and can trigger animations or logs
const sectionObserverOptions = {
    root: null, // null means the viewport
    rootMargin: '0px',
    threshold: 0.5 // triggers when 50% of the section is visible
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.log(`Section #${entry.target.id} is visible`);
        // Example: add a class to fade in
        entry.target.classList.add('section-visible');
      } else {
        console.log(`Section #${entry.target.id} is not visible`);
        // Example: remove the class if you want it to fade out again
        // entry.target.classList.remove('section-visible');
      }
    });
}, sectionObserverOptions);

// Start observing all sections
document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// Smooth Scroll with Progress Indicator
document.querySelectorAll('.navbar-links a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Update URL without page jump
            history.pushState(null, null, this.getAttribute('href'));
        }
    });
});

// Navbar Scroll Behavior
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    let currentScroll = window.scrollY;

    if (currentScroll > lastScrollTop) {
        navbar.style.top = "-80px"; // Adjust based on navbar height
    } else {
        navbar.style.top = "0";
    }

    lastScrollTop = currentScroll;
});


// Typing Animation for Hero Section
function initTypeWriter() {
    const text = "I build things for the web.";
    const tagline = document.querySelector('.hero-tagline');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    tagline.textContent = '';
    type();
}

// Run typing animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initTypeWriter();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Gather form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Here you would normally send the data to your server
            // For now, we simulate a success response
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        } catch (error) {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Dynamically add necessary CSS
const style = document.createElement('style');
style.textContent = `
    /* Hide navbar on scroll */
    .navbar-hidden {
        transform: translateY(-100%);
    }
    
    /* Navbar visual style when scrolled */
    .navbar.scrolled {
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        background-color: rgba(0, 0, 0, 0.95);
    }
    
    /* Section animation on intersection */
    .section-visible {
        animation: fadeIn 0.8s ease forwards;
    }
    
    /* Notifications */
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 24px;
        border-radius: 4px;
        background: #333;
        color: white;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 9999;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification-success {
        background: #16c9b2;
    }
    
    .notification-error {
        background: #ff4444;
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

// Toggle Blackout (disable styles) button
document.head.appendChild(style);
const toggleStyleBtn = document.getElementById('toggle-style-btn');
if (toggleStyleBtn) {
    toggleStyleBtn.addEventListener('click', function () {
        document.body.classList.toggle('disable-style');
    });
}
