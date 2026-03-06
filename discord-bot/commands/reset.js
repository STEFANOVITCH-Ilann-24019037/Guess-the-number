const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { getGuild, saveGuild } = require('../utils/db');
const { getTodayString } = require('../utils/game');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription("Reset today's game for this server (Admin only)")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const guildId = interaction.guildId;
        const guild = getGuild(guildId);
        const today = getTodayString();

        for (const player of Object.values(guild.players)) {
            player.currentAttempts = [];
        }

        guild.daily = { date: today, solved: false, winner: null };
        saveGuild(guildId, guild);

        await interaction.reply({
            content: '🔄 Today\'s game has been reset! A new number has been generated. Good luck everyone!',
            ephemeral: true
        });
    }
};
