const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuild } = require('../utils/db');
const { getTodayString } = require('../utils/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription("Show today's game info and remaining time"),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const guild = getGuild(guildId);
        const today = getTodayString();

        const isToday = guild.daily && guild.daily.date === today;
        const playersToday = isToday
            ? Object.values(guild.players).filter(p => p.currentAttempts && p.currentAttempts.length > 0).length
            : 0;
        const winner = isToday && guild.daily.winner ? guild.players[guild.daily.winner] : null;

        const tomorrowMidnight = new Date();
        tomorrowMidnight.setUTCHours(24, 0, 0, 0);
        const remaining = tomorrowMidnight - Date.now();
        const h = Math.floor(remaining / 3_600_000);
        const m = Math.floor((remaining % 3_600_000) / 60_000);

        const embed = new EmbedBuilder()
            .setColor(0xffb703)
            .setTitle('🎯 Guess the Number — Daily Game')
            .setDescription('A new number between **1 and 100** is chosen every day, unique to this server.\nUse `/guess` to play, `/leaderboard` to see rankings!')
            .addFields(
                { name: '📅 Today', value: today, inline: true },
                { name: '👥 Players today', value: `${playersToday}`, inline: true },
                { name: '⏰ Resets in', value: `${h}h ${m}m`, inline: true },
                {
                    name: '🏆 First to solve today',
                    value: winner
                        ? `**${winner.username}** in ${winner.currentAttempts.length} attempt${winner.currentAttempts.length !== 1 ? 's' : ''}`
                        : 'Not solved yet — could be you!',
                    inline: false
                }
            )
            .setFooter({ text: 'Good luck! 🎲' })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
