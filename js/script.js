const BASE_PATH = '';

async function loadHeader() {
    try {
        const response = await fetch('components/header/header.html');
        const headerHTML = await response.text();
        document.getElementById('header').innerHTML = headerHTML;

        const includes = document.querySelectorAll('#header [data-include]');
        for (const el of includes) {
            const src = el.getAttribute('data-include');
            if (!src) continue;
            try {
                const resp = await fetch(src);
                el.innerHTML = await resp.text();
            } catch (incErr) {
                console.error('Error loading include', src, incErr);
            }
        }

        initThemeToggle();
        initHamburger();
    } catch (error) {
        console.error('Error loading header:', error);
    }
}


function initHamburger() {
    const btn = document.getElementById('hamburger');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        btn.classList.toggle('open');
        links.classList.toggle('open');
    });

    // Stäng menyn när man klickar på en länk
    links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            btn.classList.remove('open');
            links.classList.remove('open');
        });
    });
}


function initThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;

    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light');
    }

    btn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submit-btn');
        const status = document.getElementById('form-status');

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const subject = form.querySelector('#subject').value.trim();
        const message = form.querySelector('#message').value.trim();

        // Validering
        if (name.length < 2) {
            status.textContent = '✗ Ange ett giltigt namn (minst 2 tecken).';
            status.style.color = '#e07070';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            status.textContent = '✗ Ange en giltig e-postadress.';
            status.style.color = '#e07070';
            return;
        }

        if (subject.length < 3) {
            status.textContent = '✗ Ange ett ämne (minst 3 tecken).';
            status.style.color = '#e07070';
            return;
        }

        if (message.length < 10) {
            status.textContent = '✗ Meddelandet är för kort (minst 10 tecken).';
            status.style.color = '#e07070';
            return;
        }

        btn.textContent = 'Skickar...';
        btn.disabled = true;
        status.textContent = '';

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
        const response = await fetch('components/contact-form/contact-form.html');
        container.innerHTML = await response.text();
        initContactForm();
    } catch (error) {
        console.error('Error loading contact form:', error);
    }
}

async function loadFooter() {
    try {
        const response = await fetch('components/footer/footer.html');
        document.getElementById('footer').innerHTML = await response.text();
        const year = document.getElementById('year');
        if (year) year.textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

function initTypewriter() {
    const el = document.getElementById('typewriter');
    if (!el) return;

    const text = el.textContent;
    el.textContent = '';

    let i = 0;
    function type() {
        if (i < text.length) {
            el.insertAdjacentText('beforeend', text[i++]);
            setTimeout(type, 50);
        }
    }

    setTimeout(type, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadContactForm();
    initTypewriter();
});