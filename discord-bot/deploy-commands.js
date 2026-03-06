require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');

for (const file of fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))) {
    const command = require(path.join(commandsPath, file));
    commands.push(command.data.toJSON());
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`⏳ Registering ${commands.length} slash commands globally...`);
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('✅ Slash commands registered successfully!');
        console.log('ℹ️  Note: Global commands can take up to 1 hour to appear in all servers.');
    } catch (error) {
        console.error('❌ Failed to register commands:', error);
    }
})();
