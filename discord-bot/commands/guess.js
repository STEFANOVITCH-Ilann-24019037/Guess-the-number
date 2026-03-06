const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuild, saveGuild } = require('../utils/db');
const { getTodayString, getDailyNumber, checkGuess } = require('../utils/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('guess')
        .setDescription('Guess today\'s secret number (between 1 and 100)')
        .addIntegerOption(option =>
            option.setName('number')
                .setDescription('Your guess')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        ),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const userId = interaction.user.id;
        const username = interaction.user.username;
        const guess = interaction.options.getInteger('number');

        const today = getTodayString();
        const secretNumber = getDailyNumber(guildId);
        const guild = getGuild(guildId);

        // Reset data if it's a new day
        if (!guild.daily || guild.daily.date !== today) {
            for (const pid of Object.keys(guild.players)) {
                if (guild.players[pid].currentAttempts && guild.players[pid].currentAttempts.length > 0) {
                    guild.players[pid].gamesPlayed = (guild.players[pid].gamesPlayed || 0) + 1;
                }
                guild.players[pid].currentAttempts = [];
            }
            guild.daily = { date: today, solved: false, winner: null };
        }

        // Ensure player exists in this guild
        if (!guild.players[userId]) {
            guild.players[userId] = {
                username,
                totalWins: 0,
                totalGuesses: 0,
                bestScore: null,
                gamesPlayed: 0,
                currentAttempts: []
            };
        }

        const player = guild.players[userId];
        player.username = username;

        // Already won today
        if (guild.daily.winner === userId) {
            return interaction.reply({
                content: `✅ You already found today's number in **${player.currentAttempts.length} attempt${player.currentAttempts.length !== 1 ? 's' : ''}**! Come back tomorrow.`,
                ephemeral: true
            });
        }

        // Already tried this number today
        if (player.currentAttempts.includes(guess)) {
            return interaction.reply({
                content: `⚠️ You already tried **${guess}** today! Pick a different number.`,
                ephemeral: true
            });
        }

        player.currentAttempts.push(guess);
        player.totalGuesses++;

        const result = checkGuess(guess, secretNumber);
        const embed = new EmbedBuilder().setTimestamp();

        if (result === 'correct') {
            const attempts = player.currentAttempts.length;
            player.totalWins++;
            if (player.bestScore === null || attempts < player.bestScore) player.bestScore = attempts;
            guild.daily.solved = true;
            guild.daily.winner = userId;

            embed
                .setColor(0x4ade80)
                .setTitle('🎯 Correct!')
                .setDescription(`<@${userId}> found today's number: **${secretNumber}**!`)
                .addFields(
                    { name: '🔢 Attempts', value: `${attempts}`, inline: true },
                    { name: '🏆 Total wins', value: `${player.totalWins}`, inline: true },
                    { name: '⭐ Best score', value: `${player.bestScore} attempt${player.bestScore !== 1 ? 's' : ''}`, inline: true }
                )
                .setFooter({ text: 'A new number starts tomorrow — come back!' });

        } else if (result === 'more') {
            embed
                .setColor(0x60a5fa)
                .setTitle('📈 Too low!')
                .setDescription(`**${guess}** is too low. The secret number is **higher**!`)
                .addFields({ name: '🔢 Attempts today', value: `${player.currentAttempts.length}`, inline: true });
        } else {
            embed
                .setColor(0xfb923c)
                .setTitle('📉 Too high!')
                .setDescription(`**${guess}** is too high. The secret number is **lower**!`)
                .addFields({ name: '🔢 Attempts today', value: `${player.currentAttempts.length}`, inline: true });
        }

        guild.players[userId] = player;
        saveGuild(guildId, guild);

        await interaction.reply({ embeds: [embed] });
    }
};
