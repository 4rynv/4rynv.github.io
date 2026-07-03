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

    syncGiscusTheme();
}

// ============================================
// GISCUS THEME SYNC
// ============================================

// Keep the embedded giscus comment widget in sync with the site's own theme toggle
function syncGiscusTheme() {
    const iframe = document.querySelector('iframe.giscus-frame');
    if (!iframe) return;

    const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        'https://giscus.app'
    );
}

// giscus announces readiness via postMessage once its iframe has loaded
window.addEventListener('message', (event) => {
    if (event.origin !== 'https://giscus.app') return;
    if (event.data?.giscus?.discussion !== undefined || event.data?.giscus) {
        syncGiscusTheme();
    }
});
