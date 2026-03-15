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

    const knob = btn.querySelector('.theme-knob');

    const updateIcon = (isLight) => {
        knob.textContent = isLight ? '☾' : '☼';
    };

    const isLight = localStorage.getItem('theme') === 'light';
    if (isLight) document.documentElement.classList.add('light');
    updateIcon(isLight);

    btn.addEventListener('click', () => {
        const isLight = document.documentElement.classList.toggle('light');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateIcon(isLight);
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const ERROR_COLOR = '#e07070';
    const SUCCESS_COLOR = '#00fc8b';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = document.getElementById('submit-btn');
        const status = document.getElementById('form-status');

        const name = form.querySelector('#name').value.trim();
        const email = form.querySelector('#email').value.trim();
        const subject = form.querySelector('#subject').value.trim();
        const message = form.querySelector('#message').value.trim();

        const showError = (msg) => {
            status.textContent = msg;
            status.style.color = ERROR_COLOR;
        };

        if (name.length < 2) return showError('Ange ett giltigt namn (minst 2 tecken).');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Ange en giltig e-postadress.');
        if (subject.length < 3) return showError('Ange ett ämne (minst 3 tecken).');
        if (message.length < 10) return showError('Meddelandet är för kort (minst 10 tecken).');

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
                status.textContent = 'Tack! Ditt meddelande har skickats.';
                status.style.color = SUCCESS_COLOR;
            } else {
                throw new Error();
            }
        } catch {
            btn.textContent = 'Skicka Meddelande';
            btn.disabled = false;
            showError('Något gick fel. Försök igen.');
        }
    });
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
            setTimeout(type, 65);
        }
    }

    setTimeout(type, 500);
}

function initYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHamburger();
    initContactForm();
    initTypewriter();
    initYear();
});