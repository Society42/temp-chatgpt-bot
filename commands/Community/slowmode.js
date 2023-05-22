const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slow mode for a channel')
    .addChannelOption(option => option.setName('channel').setDescription('The channel to set slow mode').setRequired(true))
    .addIntegerOption(option => option.setName('duration').setDescription('The duration of slow mode in seconds').setRequired(true)),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');
    const duration = interaction.options.getInteger('duration');

    const member = interaction.member;
    const memberPermissions = channel.permissionsFor(member);

    if (!memberPermissions.has(PermissionsBitField.Flags.ManageChannels)) {
      return interaction.reply('You do not have the necessary permissions to set slow mode in this channel.');
    }

    try {
      await channel.setRateLimitPerUser(duration);
      interaction.reply(`Slow mode has been set to ${duration} seconds in ${channel}`);
    } catch (error) {
      console.error('Failed to set slow mode:', error);
      interaction.reply('Failed to set slow mode. Please check the channel and duration provided.');
    }
  },
};
