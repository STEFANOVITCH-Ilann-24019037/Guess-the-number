document.addEventListener('DOMContentLoaded', () => {
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const messageEl = document.getElementById('message');
    const attemptsContainer = document.getElementById('attempts');

    const attempts = [];
    const secretNumber = getDailyNumber();

    guessButton.addEventListener('click', checkGuess);
    guessInput.addEventListener('keyup', e => { if (e.key === 'Enter') checkGuess(); });

    function getDailyNumber() {
        const today = new Date().toDateString();
        const stored = JSON.parse(localStorage.getItem('guessTheNumber'));
        if (stored && stored.date === today) return stored.number;
        const number = Math.floor(Math.random() * 100) + 1;
        localStorage.setItem('guessTheNumber', JSON.stringify({ number, date: today }));
        return number;
    }

    function checkGuess() {
        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            setMessage('Please enter a valid number between 1 and 100.', 'error');
            return;
        }

        if (userGuess === secretNumber) {
            setMessage(`🎉 Correct! The number was ${secretNumber}!`, 'correct');
            guessInput.disabled = true;
            guessButton.disabled = true;
            attempts.push({ guess: userGuess, feedback: 'correct' });
        } else if (userGuess < secretNumber) {
            setMessage('📈 Higher! Try a bigger number.', 'more');
            attempts.push({ guess: userGuess, feedback: 'more' });
        } else {
            setMessage('📉 Lower! Try a smaller number.', 'less');
            attempts.push({ guess: userGuess, feedback: 'less' });
        }

        renderAttempts();
        guessInput.value = '';
        guessInput.focus();
    }

    function setMessage(text, type) {
        messageEl.textContent = text;
        messageEl.dataset.type = type;
    }

    function renderAttempts() {
        if (attempts.length === 0) return;

        attemptsContainer.innerHTML = '<h3>Previous attempts</h3>';
        const list = document.createElement('ul');

        attempts.forEach(({ guess, feedback }) => {
            const li = document.createElement('li');
            li.dataset.feedback = feedback;
            const icon = feedback === 'more' ? '↑' : feedback === 'less' ? '↓' : '✓';
            const label = feedback === 'more' ? 'Too low' : feedback === 'less' ? 'Too high' : 'Correct';
            li.innerHTML = `<span class="guess-number">${guess}</span><span class="guess-label">${icon} ${label}</span>`;
            list.appendChild(li);
        });

        attemptsContainer.appendChild(list);
    }
});
