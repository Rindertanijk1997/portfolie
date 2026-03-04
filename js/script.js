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


function initQuiz() {
    const quizEl = document.getElementById('quiz');
    if (!quizEl) return;

    const questions = [
        {
            question: 'Vilket lag hejar Rindert på?',
            options: ['Liverpool FC', 'Everton FC'],
            correct: 0
        },
         {
            question: 'Vad beställer Rindert på restaurang?',
            options: ['Räkmacka', 'Moules frites'],
            correct: 1
        },
        {
            question: 'Vilket är Rinderts favoritsport utanför fotboll?',
            options: ['Golf', 'Tennis'],
            correct: 0
        },
        {
            question: 'Vad är Rinderts favoritresmål?',
            options: ['Franska Rivieran', 'Italien'],
            correct: 0
        },
        {
            question: 'Hur föredrar Rindert att jobba?',
            options: ['Remote hemifrån', 'På kontor med kollegor'],
            correct: 1
        }
    ];

    let current = 0;
    let score = 0;

    function showQuestion() {
        const q = questions[current];
        document.getElementById('quiz-question').textContent = q.question;
        document.getElementById('quiz-current').textContent = current + 1;

        const optionsEl = document.getElementById('quiz-options');
        optionsEl.innerHTML = '';

        q.options.forEach((option, i) => {
            const btn = document.createElement('button');
            btn.textContent = option;
            btn.className = 'quiz-btn';
            btn.addEventListener('click', () => answer(i));
            optionsEl.appendChild(btn);
        });
    }

    function answer(index) {
        const q = questions[current];
        const buttons = document.querySelectorAll('.quiz-btn');

        buttons.forEach(btn => btn.disabled = true);

        if (index === q.correct) {
            buttons[index].classList.add('correct');
            score++;
        } else {
            buttons[index].classList.add('wrong');
            buttons[q.correct].classList.add('correct');
        }

        setTimeout(() => {
            current++;
            if (current < questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        }, 1000);
    }

    function showResult() {
        document.getElementById('quiz').style.display = 'none';
        const result = document.getElementById('quiz-result');
        result.style.display = 'block';

        const messages = [
            { min: 0, max: 1, text: ' Hmm, vi har nog inte träffats ännu!' },
            { min: 2, max: 3, text: ' Inte illa! Du känner mig lite grann.' },
            { min: 4, max: 4, text: ' Bra jobbat! Du känner mig ganska väl.' },
            { min: 5, max: 5, text: ' Perfekt! Har vi träffats förut?' }
        ];

        const msg = messages.find(m => score >= m.min && score <= m.max);

        result.innerHTML = `
            <div class="quiz-score">${score} / 5</div>
            <p class="quiz-message">${msg.text}</p>
            <button class="btn quiz-restart">Försök igen</button>
        `;

        result.querySelector('.quiz-restart').addEventListener('click', () => {
            current = 0;
            score = 0;
            result.style.display = 'none';
            document.getElementById('quiz').style.display = 'block';
            showQuestion();
        });
    }

    showQuestion();
}

document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
    loadContactForm();
    initTypewriter();
    initQuiz();
});