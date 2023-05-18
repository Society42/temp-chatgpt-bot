const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Enter the reason for kicking')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    if (!user.kickable) {
      return interaction.reply({
        content: 'I cannot kick this user. Please check my permissions and role hierarchy.',
        ephemeral: true,
      });
    }

    await user.kick(reason);

    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('User Kicked')
      .setDescription(`**Kicked User:** ${user}\n**Reason:** ${reason}`)
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};
