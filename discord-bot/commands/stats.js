const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getGuild } = require('../utils/db');
const { getTodayString } = require('../utils/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('View stats for a player')
        .addUserOption(option =>
            option.setName('player')
                .setDescription('The player to check (default: yourself)')
                .setRequired(false)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('player') || interaction.user;
        const guild = getGuild(interaction.guildId);
        const player = guild.players[target.id];

        if (!player) {
            return interaction.reply({
                content: `❌ **${target.username}** hasn't played yet on this server!`,
                ephemeral: true
            });
        }

        const today = getTodayString();
        const isToday = guild.daily && guild.daily.date === today;
        const todayAttempts = isToday && player.currentAttempts ? player.currentAttempts.length : 0;
        const wonToday = guild.daily && guild.daily.winner === target.id;
        const winRate = player.gamesPlayed > 0
            ? `${Math.round((player.totalWins / player.gamesPlayed) * 100)}%`
            : 'N/A';

        const embed = new EmbedBuilder()
            .setColor(0xffb703)
            .setTitle(`📊 Stats — ${player.username}`)
            .setThumbnail(target.displayAvatarURL())
            .addFields(
                { name: '🏆 Total wins', value: `${player.totalWins}`, inline: true },
                { name: '🎮 Games played', value: `${player.gamesPlayed}`, inline: true },
                { name: '📈 Win rate', value: winRate, inline: true },
                { name: '🔢 Total guesses', value: `${player.totalGuesses}`, inline: true },
                { name: '⭐ Best score', value: player.bestScore !== null ? `${player.bestScore} attempts` : 'N/A', inline: true },
                {
                    name: '📅 Today',
                    value: wonToday
                        ? `✅ Won in ${player.currentAttempts.length} attempts`
                        : todayAttempts > 0
                            ? `${todayAttempts} attempt${todayAttempts !== 1 ? 's' : ''} so far`
                            : 'Not played today',
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
