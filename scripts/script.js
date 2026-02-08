// Dark mode toggle
const themeIcon = document.getElementById('theme-icon');
const currentTheme = localStorage.getItem('theme') || 'light';

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeIcon.classList.remove('sun');
    themeIcon.classList.add('moon');
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const header = document.querySelector('header');
    
    // Add animation class
    header.classList.add('theme-changing');
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('moon');
        themeIcon.classList.add('sun');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('sun');
        themeIcon.classList.add('moon');
    }
    
    // Remove animation class after animation completes
    setTimeout(() => {
        header.classList.remove('theme-changing');
    }, 1000);
}

// Navigation
function navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(page + '-page').classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    window.scrollTo(0, 0);
}

// Instant toggle for content words (Aryan Vyapari, Mumbai)
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

// Fade toggle for page titles (PROJECTS, BLOG, FRIENDS)
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

// Initialize all toggles when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Content words - instant toggle
    document.querySelectorAll('.script-toggle-content').forEach(element => {
        setupContentToggle(element);
    });
    
    // Page titles - fade toggle
    document.querySelectorAll('.script-toggle-title').forEach(element => {
        setupTitleToggle(element);
    });
    
    // Nav links - automatic random toggle
    document.querySelectorAll('.script-toggle-nav').forEach(link => {
        setupNavToggle(link);
    });
});