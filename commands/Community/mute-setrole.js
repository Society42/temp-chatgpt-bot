const { SlashCommandBuilder } = require('@discordjs/builders');
const {  PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('muterole-set')
    .setDescription('Set the mute role for the server')
    .addRoleOption(option => option.setName('role').setDescription('The mute role').setRequired(true)),
  async execute(interaction) {
    const role = interaction.options.getRole('role');

    if (!interaction.guild.me.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({
        content: 'I do not have the necessary permissions to manage roles.',
        ephemeral: true
      });
    }

    try {

      await interaction.reply(`Mute role set to ${role.name}.`);
    } catch (error) {
      console.error('Failed to set the mute role:', error);
      await interaction.reply({ content: 'An error occurred while setting the mute role.', ephemeral: true });
    }
  },
};
