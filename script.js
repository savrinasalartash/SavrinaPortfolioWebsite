/* ============================================================================
   Theme Management
   ============================================================================ */

const themeToggle = document.querySelector('.theme-toggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let theme = 'light';
    if (savedTheme) {
        theme = savedTheme;
    } else if (prefersDark) {
        theme = 'dark';
    }

    applyTheme(theme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    applyTheme(isDark ? 'light' : 'dark');
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
    }
});

/* ============================================================================
   Smooth Scroll Enhancement
   ============================================================================ */

// Add smooth scroll behavior to navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================================================
   Active Navigation Link Highlighting
   ============================================================================ */

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
   let currentSection = '';

   sections.forEach((section) => {
       const sectionTop = section.offsetTop - 100;
       if (window.scrollY >= sectionTop) {
           currentSection = section.getAttribute('id');
       }
   });

   navLinks.forEach((link) => {
       link.classList.remove('active');
       if (link.getAttribute('href') === `#${currentSection}`) {
           link.classList.add('active');
       }
   });
}

window.addEventListener('scroll', updateActiveLink);
document.addEventListener('DOMContentLoaded', updateActiveLink);

/* ============================================================================
   Intersection Observer for Animations
   ============================================================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 0.6s ease-out';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe timeline items and project cards for animation on scroll
document.querySelectorAll('.timeline-item, .project-card, .education-item').forEach((el) => {
    observer.observe(el);
});

/* ============================================================================
   Performance Optimization
   ============================================================================ */

// Lazy load images if any are added in the future
if ('IntersectionObserver' in window && 'IntersectionObserverEntry' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
    });
}

/* ============================================================================
   Accessibility Enhancements
   ============================================================================ */

// Enhance keyboard navigation
document.addEventListener('keydown', (e) => {
    // Theme toggle with Shift+T
    if (e.shiftKey && e.key === 'T') {
        themeToggle.click();
    }
    // Skip to main content with Alt+M
    if (e.altKey && e.key === 'm') {
        document.querySelector('main').focus();
    }
});

// Add focus visible style for better keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

/* ============================================================================
   Analytics & Tracking (Optional)
   ============================================================================ */

// Track page views and interactions
function trackEvent(eventName, eventData) {
    // This is a placeholder for analytics integration
    // Can be connected to Google Analytics, Mixpanel, or similar services
    console.log(`Event: ${eventName}`, eventData);
}

// Track when user clicks on contact links
document.querySelectorAll('.contact-link').forEach((link) => {
    link.addEventListener('click', () => {
        const linkType = link.getAttribute('href').includes('mailto') ? 'email' : link.getAttribute('href').includes('tel') ? 'phone' : 'social';
        trackEvent('contact_click', { type: linkType });
    });
});

// Track when user downloads resume
document.querySelectorAll('[download]').forEach((link) => {
    link.addEventListener('click', () => {
        trackEvent('resume_download', { timestamp: new Date().toISOString() });
    });
});

/* ============================================================================
   Initialization
   ============================================================================ */

document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    // Add animation delay to stagger timeline items
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });

    console.log('Portfolio initialized successfully');
});

/* ============================================================================
   Service Worker Registration (Optional PWA Support)
   ============================================================================ */

if ('serviceWorker' in navigator) {
    // Uncomment to enable PWA features
    // window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/sw.js').catch(() => {
    //         console.log('Service Worker registration failed or not available');
    //     });
    // });
}
