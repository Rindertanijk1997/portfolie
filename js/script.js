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

async function loadHeader() {
    try {
        const response = await fetch(BASE_PATH + 'components/header/header.html');
        const headerHTML = await response.text();
        document.getElementById('header').innerHTML = headerHTML;

        const includes = document.querySelectorAll('#header [data-include]');
        for (const el of includes) {
            const src = el.getAttribute('data-include');
            if (!src) continue;
            try {
                const resp = await fetch(BASE_PATH + src);
                el.innerHTML = await resp.text();
            } catch (incErr) {
                console.error('Error loading include', src, incErr);
            }
        }

        fixNavLinks();
    } catch (error) {
        console.error('Error loading header:', error);
    }
    initThemeToggle();
}

function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    const label = btn.querySelector('.theme-label');

    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light');
        label.textContent = 'Dark mode';
    } else {
        label.textContent = 'Light mode';
    }

    btn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light');
        label.textContent = isLight ? 'Dark mode' : 'Light mode';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

function fixNavLinks() {
    document.querySelectorAll('.nav a').forEach(link => {
        let href = link.getAttribute('href');
        if (!href || href.startsWith('#') || CURRENT_DIR === 'root') return;

        if (CURRENT_DIR === 'pages') {
            if (href === 'index.html') link.setAttribute('href', '../index.html');
            else if (href.startsWith('pages/')) link.setAttribute('href', href.replace(/^pages\//, ''));
            else if (!href.startsWith('../')) link.setAttribute('href', '../' + href);
        }

        if (CURRENT_DIR === 'projects') {
            if (href === 'index.html') link.setAttribute('href', '../index.html');
            else if (href.startsWith('projects/')) link.setAttribute('href', href.replace(/^projects\//, ''));
            else if (!href.startsWith('../')) link.setAttribute('href', '../' + href);
        }
    });

    const logo = document.querySelector('.logo');
    if (logo && logo.getAttribute('href') === 'index.html' && CURRENT_DIR !== 'root') {
        logo.setAttribute('href', '../index.html');
    }
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submit-btn');
        const status = document.getElementById('form-status');

        btn.textContent = 'Skickar...';
        btn.disabled = true;

        try {
            const response = await fetch('https://formspree.io/f/xaqdbeln', {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                btn.textContent = 'Skickat!';
                status.textContent = '✓ Tack! Ditt meddelande har skickats.';
                status.style.color = '#00fc8b';
            } else {
                throw new Error();
            }
        } catch {
            btn.textContent = 'Skicka Meddelande';
            btn.disabled = false;
            status.textContent = '✗ Något gick fel. Försök igen.';
            status.style.color = '#e07070';
        }
    });
}

async function loadContactForm() {
    const container = document.getElementById('contact-form-container');
    if (!container) return;
    try {
        const response = await fetch(BASE_PATH + 'components/contact-form/contact-form.html');
        container.innerHTML = await response.text();
        initContactForm();
    } catch (error) {
        console.error('Error loading contact form:', error);
    }
}

async function loadFooter() {
    try {
        const response = await fetch(BASE_PATH + 'components/footer/footer.html');
        document.getElementById('footer').innerHTML = await response.text();
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadContactForm();
});