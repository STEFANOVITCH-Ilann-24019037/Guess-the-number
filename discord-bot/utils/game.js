function getTodayString() {
    return new Date().toDateString();
}

// Generates a deterministic number (1-100) based on date + guild — unique per server per day
function getDailyNumber(guildId) {
    const seed = `${getTodayString()}-${guildId}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i);
        hash = hash & hash; // convert to 32-bit int
    }
    return (Math.abs(hash) % 100) + 1;
}

function checkGuess(guess, secret) {
    if (guess === secret) return 'correct';
    if (guess < secret) return 'more';
    return 'less';
}

module.exports = { getTodayString, getDailyNumber, checkGuess };
