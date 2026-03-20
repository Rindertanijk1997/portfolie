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


function initQuiz() {
    const quizEl = document.getElementById('quiz');
    if (!quizEl) return;

    const questions = [
        { question: 'Vilket lag hejar Rindert på?', options: ['Liverpool FC', 'Everton FC'], correct: 0 },
        { question: 'Vad beställer Rindert på restaurang?', options: ['Räkmacka', 'Moules frites'], correct: 1 },
        { question: 'Vilket är Rinderts favoritsport utanför fotboll?', options: ['Golf', 'Tennis'], correct: 0 },
        { question: 'Vad är Rinderts favoritresmål?', options: ['Franska Rivieran', 'Italien'], correct: 0 },
        { question: 'Hur föredrar Rindert att jobba?', options: ['Remote hemifrån', 'På kontor med kollegor'], correct: 1 }
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
            { min: 0, max: 1, text: 'Hmm, vi har nog inte träffats ännu!' },
            { min: 2, max: 3, text: 'Inte illa! Du känner mig lite grann.' },
            { min: 4, max: 4, text: 'Bra jobbat! Du känner mig ganska väl.' },
            { min: 5, max: 5, text: 'Perfekt! Har vi träffats förut?' }
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
    initThemeToggle();
    initHamburger();
    initContactForm();
    initTypewriter();
    initQuiz();
    initYear();
});