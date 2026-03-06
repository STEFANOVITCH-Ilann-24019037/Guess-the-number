const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

function ensureDB() {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify({ guilds: {} }, null, 2));
}

function read() {
    ensureDB();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function write(data) {
    ensureDB();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

function getGuild(guildId) {
    const db = read();
    if (!db.guilds[guildId]) {
        db.guilds[guildId] = { daily: null, players: {} };
        write(db);
    }
    return db.guilds[guildId];
}

function saveGuild(guildId, guildData) {
    const db = read();
    db.guilds[guildId] = guildData;
    write(db);
}

module.exports = { getGuild, saveGuild };
