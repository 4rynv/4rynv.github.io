// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

// Dark mode toggle
const themeIcon = document.getElementById('theme-icon');
const currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on page load
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeIcon) {
        themeIcon.classList.remove('sun');
        themeIcon.classList.add('moon');
    }
}

// Toggle between light and dark themes
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const header = document.querySelector('header');
    
    // Add animation class only if header exists (for main site pages)
    if (header) {
        header.classList.add('theme-changing');
    }
    
    // Switch theme
    if (currentTheme === 'dark') {
        // Switch to light mode
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('moon');
            themeIcon.classList.add('sun');
        }
    } else {
        // Switch to dark mode
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('sun');
            themeIcon.classList.add('moon');
        }
    }
    
    // Remove animation class after animation completes
    if (header) {
        setTimeout(() => {
            header.classList.remove('theme-changing');
        }, 1000);
    }
}

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

// Navigate between pages
function navigateTo(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(page + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// ============================================
// SCRIPT TOGGLE FUNCTIONALITY (LATIN ⟷ DEVANAGARI)
// ============================================

// Instant toggle for content words (e.g., Aryan Vyapari, Mumbai)
function setupContentToggle(element) {
    const latin = element.getAttribute('data-latin');
    const devanagari = element.getAttribute('data-devanagari');
    
    if (!latin || !devanagari) return;
    
    element.addEventListener('mouseenter', () => {
        element.textContent = devanagari;
        element.classList.add('devanagari');
    });
    
    element.addEventListener('mouseleave', () => {
        element.textContent = latin;
        element.classList.remove('devanagari');
    });
}

// Fade toggle for page titles (e.g., PROJECTS, BLOG, FRIENDS)
function setupTitleToggle(element) {
    const latin = element.getAttribute('data-latin');
    const devanagari = element.getAttribute('data-devanagari');
    
    if (!latin || !devanagari) return;
    
    let isHovering = false;
    
    element.addEventListener('mouseenter', () => {
        isHovering = true;
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (isHovering) {
                element.textContent = devanagari;
                element.classList.add('devanagari');
                element.style.opacity = '1';
            }
        }, 200);
    });
    
    element.addEventListener('mouseleave', () => {
        isHovering = false;
        element.style.opacity = '0';
        
        setTimeout(() => {
            if (!isHovering) {
                element.textContent = latin;
                element.classList.remove('devanagari');
                element.style.opacity = '1';
            }
        }, 200);
    });
}

// Automatic random toggle for nav links
function setupNavToggle(link) {
    const latin = link.getAttribute('data-latin');
    const devanagari = link.getAttribute('data-devanagari');
    
    if (!latin || !devanagari) return;
    
    let isDevanagari = false;
    
    function toggle() {
        link.style.opacity = '0';
        
        setTimeout(() => {
            if (isDevanagari) {
                link.textContent = latin;
                link.classList.remove('devanagari');
                isDevanagari = false;
            } else {
                link.textContent = devanagari;
                link.classList.add('devanagari');
                isDevanagari = true;
            }
            link.style.opacity = '1';
            
            // Random interval between 2-5 seconds
            const randomDelay = Math.random() * 3000 + 2000;
            setTimeout(toggle, randomDelay);
        }, 200);
    }
    
    // Start after random initial delay (1-4 seconds)
    const initialDelay = Math.random() * 3000 + 1000;
    setTimeout(toggle, initialDelay);
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize all toggles when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Content words - instant toggle on hover
    document.querySelectorAll('.script-toggle-content').forEach(element => {
        setupContentToggle(element);
    });
    
    // Page titles - fade toggle on hover
    document.querySelectorAll('.script-toggle-title').forEach(element => {
        setupTitleToggle(element);
    });
    
    // Nav links - automatic random toggle
    document.querySelectorAll('.script-toggle-nav').forEach(link => {
        setupNavToggle(link);
    });
});