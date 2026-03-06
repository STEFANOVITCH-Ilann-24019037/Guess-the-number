const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuild } = require('../utils/db');
const { getTodayString } = require('../utils/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show the server leaderboard')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Ranking type (default: most wins)')
                .setRequired(false)
                .addChoices(
                    { name: '🏆 Most Wins', value: 'wins' },
                    { name: '⭐ Best Score (fewest attempts)', value: 'best' },
                    { name: '📅 Today\'s Attempts', value: 'today' }
                )
        ),

    async execute(interaction) {
        const type = interaction.options.getString('type') || 'wins';
        const guildId = interaction.guildId;
        const guild = getGuild(guildId);
        const playerEntries = Object.entries(guild.players);

        if (playerEntries.length === 0) {
            return interaction.reply({ content: '❌ No players have played on this server yet!', ephemeral: true });
        }

        const medal = i => i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `**${i + 1}.**`;

        let title, description;

        if (type === 'wins') {
            const sorted = playerEntries
                .sort(([, a], [, b]) => b.totalWins - a.totalWins)
                .slice(0, 10);
            title = '🏆 Leaderboard — Most Wins';
            description = sorted.map(([, p], i) =>
                `${medal(i)} **${p.username}** — ${p.totalWins} win${p.totalWins !== 1 ? 's' : ''}`
            ).join('\n');

        } else if (type === 'best') {
            const sorted = playerEntries
                .filter(([, p]) => p.bestScore !== null)
                .sort(([, a], [, b]) => a.bestScore - b.bestScore)
                .slice(0, 10);
            title = '⭐ Leaderboard — Best Score';
            description = sorted.length > 0
                ? sorted.map(([, p], i) =>
                    `${medal(i)} **${p.username}** — ${p.bestScore} attempt${p.bestScore !== 1 ? 's' : ''}`
                ).join('\n')
                : 'No wins recorded yet.';

        } else {
            const today = getTodayString();
            const isToday = guild.daily && guild.daily.date === today;
            if (!isToday) {
                return interaction.reply({ content: '❌ No game data for today yet. Be the first to `/guess`!', ephemeral: true });
            }
            const sorted = playerEntries
                .filter(([, p]) => p.currentAttempts && p.currentAttempts.length > 0)
                .sort(([, a], [, b]) => a.currentAttempts.length - b.currentAttempts.length)
                .slice(0, 10);
            title = "📅 Today's Leaderboard";
            description = sorted.length > 0
                ? sorted.map(([uid, p], i) => {
                    const won = guild.daily.winner === uid ? ' ✅' : '';
                    return `${medal(i)} **${p.username}** — ${p.currentAttempts.length} attempt${p.currentAttempts.length !== 1 ? 's' : ''}${won}`;
                }).join('\n')
                : 'Nobody has played today yet!';
        }

        const embed = new EmbedBuilder()
            .setColor(0xffb703)
            .setTitle(title)
            .setDescription(description)
            .setFooter({ text: interaction.guild.name })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
