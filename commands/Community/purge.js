const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Delete multiple messages in a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The number of messages to delete')
        .setRequired(true)),
  async execute(interaction) {

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FFB800')
        .setDescription('You do not have the required permissions to use this command.');

      return interaction.reply({ embeds: [errorEmbed] });
    }

    const amount = interaction.options.getInteger('amount');

    if (amount <= 0 || amount > 100) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FFB800')
        .setDescription('Please provide a valid amount between 1 and 100.');

      return interaction.reply({ embeds: [errorEmbed] });
    }

    await interaction.channel.bulkDelete(amount, true)
      .then(messages => {
        const successEmbed = new EmbedBuilder()
          .setColor('#FFB800')
          .setDescription(`Successfully deleted ${messages.size} message(s).`);

        interaction.reply({ embeds: [successEmbed] });
      })
      .catch(error => {
        console.error('Failed to delete messages:', error);

        const errorEmbed = new EmbedBuilder()
          .setColor('#FFB800')
          .setDescription('An error occurred while deleting messages.');

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      });
  },
};
