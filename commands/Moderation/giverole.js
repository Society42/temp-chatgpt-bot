const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giverole')
    .setDescription('Give a role to a user')
    .addUserOption(option => option.setName('user').setDescription('User to give the role').setRequired(true))
    .addRoleOption(option => option.setName('role').setDescription('Role to give to the user').setRequired(true)),
  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
      return interaction.reply({ content: 'You do not have the required permissions to use this command.', ephemeral: true });
    }

    const user = interaction.options.getMember('user');
    const role = interaction.options.getRole('role');

    try {

        await user.roles.add(role);

      const embed = new EmbedBuilder()
        .setColor('#FFB800')
        .setTitle('Role Added')
        .setDescription(`The role **${role.name}** has been given to ${user.user.tag}`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to give role:', error);
      interaction.reply({ content: 'An error occurred while trying to give the role.', ephemeral: true });
    }
  },
};
