// Utility: Throttle for scroll/resize
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// ==== Navbar Hide on Scroll + Shadow ====
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
window.addEventListener('scroll', throttle(function () {
    const current = window.scrollY;
    if (current > 12) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    if (current > lastScrollTop && current > 80) {
        navbar.classList.add('navbar-hidden');
    } else {
        navbar.classList.remove('navbar-hidden');
    }
    lastScrollTop = current;
}, 80));

// ==== Mobile Menu ====
const menuBtn = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('.navbar-links');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuBtn.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// ==== Smooth Scroll & Update URL ====
document.querySelectorAll('.navbar-links a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, null, this.getAttribute('href'));
        }
    });
});

// ==== Intersection Observer: Fade-in Section Animation ====
const sectionObserverOptions = { root: null, rootMargin: '0px', threshold: 0.3 };
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, sectionObserverOptions);

// Observe sections AND cards for animation
document.querySelectorAll('section, .work-card, .project-card, .education-card').forEach((element, i) => {
    sectionObserver.observe(element);
    element.style.transitionDelay = `${i * 0.14 + 0.08}s`;
});

// ==== Typing Animation for Hero Tagline ====
function initTypeWriter() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;
    const text = tagline.dataset.typed || "Building seamless web experiences";
    tagline.textContent = '';
    let i = 0;
    function type() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(type, 70);
        }
    }
    type();
}
// Run typewriter when hero appears
const heroSection = document.querySelector('.hero');
if (heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                initTypeWriter();
                heroObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });
    heroObserver.observe(heroSection);
}

// ==== Project Card 3D Tilt Effect ====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2, cy = rect.height / 2;
        const dx = (x - cx) / cx, dy = (y - cy) / cy;
        card.style.transform = `rotateY(${dx * 7}deg) rotateX(${-dy * 7}deg) scale(1.04)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ==== Floating Particles ====
function createParticle() {
    const p = document.createElement('div');
    p.className = 'particle';
    document.body.appendChild(p);
    const size = Math.random() * 7 + 3;
    p.style.width = p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}vw`;
    p.style.animationDuration = `${4 + Math.random() * 8}s`;
    setTimeout(() => p.remove(), 14000);
}
setInterval(createParticle, 600);

// ==== Notification System ====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 350);
    }, 3400);
}

// ==== Toggle Blackout Mode (Button & 'K' Key) ====
const toggleStyleBtn = document.getElementById('toggle-style-btn');
if (toggleStyleBtn) {
    toggleStyleBtn.addEventListener('click', function () {
        document.body.classList.toggle('disable-style');
        showNotification('🕶️ Blackout mode toggled!', 'info');
    });
}
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'k') {
        document.body.classList.toggle('disable-style');
        showNotification('🕶️ Blackout mode toggled!', 'info');
    }
});

// ==== (Optional) Contact Form with Notification ====
// If you ever add a <form class="contact-form">...
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        try {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            // simulate AJAX
            await new Promise(res => setTimeout(res, 1200));
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        } catch {
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}