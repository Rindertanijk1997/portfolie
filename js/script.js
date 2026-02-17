// Determine the base path
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/') || path.includes('/projects/')) {
        return '../';
    }
    return '';
}

const BASE_PATH = getBasePath();
const CURRENT_DIR = (function(){
    const p = window.location.pathname;
    if (p.includes('/pages/')) return 'pages';
    if (p.includes('/projects/')) return 'projects';
    return 'root';
})();

// Load Header
async function loadHeader() {
    try {
        const response = await fetch(BASE_PATH + 'components/header/header.html');
        const headerHTML = await response.text();
        document.getElementById('header').innerHTML = headerHTML;
        
        // Find any data-include placeholders inside header and load corresponding components
        const includes = document.querySelectorAll('#header [data-include]');
        for (const el of includes) {
            const src = el.getAttribute('data-include');
            if (!src) continue;
            try {
                const resp = await fetch(BASE_PATH + src);
                const html = await resp.text();
                el.innerHTML = html;
            } catch (incErr) {
                console.error('Error loading include', src, incErr);
            }
        }

        // Fix navigation links based on current depth
        fixNavLinks();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}

// Fix navigation links
function fixNavLinks() {
    const navLinks = document.querySelectorAll('.nav a');

    navLinks.forEach(link => {
        let href = link.getAttribute('href');

        if (!href) return;
        // Don't modify anchor links
        if (href.startsWith('#')) return;

        // Normalize based on current directory
        if (CURRENT_DIR === 'root') {
            // root: leave as-is
            return;
        }

        if (CURRENT_DIR === 'pages') {
            if (href === 'index.html') {
                link.setAttribute('href', '../index.html');
                return;
            }
            if (href.startsWith('pages/')) {
                // pages/about.html -> about.html
                link.setAttribute('href', href.replace(/^pages\//, ''));
                return;
            }
            if (href.startsWith('projects/')) {
                // projects/... from pages -> ../projects/...
                link.setAttribute('href', '../' + href);
                return;
            }
            if (!href.startsWith('../') && !href.startsWith('/')) {
                link.setAttribute('href', '../' + href);
                return;
            }
        }

        if (CURRENT_DIR === 'projects') {
            if (href === 'index.html') {
                link.setAttribute('href', '../index.html');
                return;
            }
            if (href.startsWith('projects/')) {
                // projects/project1.html -> project1.html
                link.setAttribute('href', href.replace(/^projects\//, ''));
                return;
            }
            if (href.startsWith('pages/')) {
                // pages/... from projects -> ../pages/...
                link.setAttribute('href', '../' + href);
                return;
            }
            if (!href.startsWith('../') && !href.startsWith('/')) {
                link.setAttribute('href', '../' + href);
                return;
            }
        }
    });
}

// Load Footer
async function loadFooter() {
    try {
        const response = await fetch(BASE_PATH + 'components/footer/footer.html');
        const footerHTML = await response.text();
        document.getElementById('footer').innerHTML = footerHTML;
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load on page load
document.addEventListener('DOMContentLoaded', function() {
    loadHeader();
    loadFooter();
});