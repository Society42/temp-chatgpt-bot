const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge-user')
    .setDescription('Delete messages from a specific user in the channel')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user whose messages will be deleted')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The number of messages to delete (default: 10)')
        .setRequired(false)),
  async execute(interaction) {
    // Check if the user has the MANAGE_MESSAGES permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FFB800')
        .setDescription('You do not have the required permissions to use this command.');

      return interaction.reply({ embeds: [errorEmbed] });
    }

    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount') || 10;

    if (amount <= 0 || amount > 100) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#FFB800')
        .setDescription('Please provide a valid amount between 1 and 100.');

      return interaction.reply({ embeds: [errorEmbed] });
    }

    await interaction.channel.messages.fetch({ limit: amount })
      .then(messages => {
        const userMessages = messages.filter(msg => msg.author.id === user.id);

        if (userMessages.size === 0) {
          const notFoundEmbed = new EmbedBuilder()
            .setColor('#FFB800')
            .setDescription('No messages found from the specified user.');

          return interaction.reply({ embeds: [notFoundEmbed] });
        }

        interaction.channel.bulkDelete(userMessages, true)
          .then(deletedMessages => {
            const successEmbed = new EmbedBuilder()
              .setColor('#FFB800')
              .setDescription(`Successfully deleted ${deletedMessages.size} message(s) from ${user.tag}.`);

            interaction.reply({ embeds: [successEmbed] });
          })
          .catch(error => {
            console.error('Failed to delete messages:', error);

            const errorEmbed = new EmbedBuilder()
              .setColor('#FFB800')
              .setDescription('An error occurred while deleting messages.');

            interaction.reply({ embeds: [errorEmbed] });
          });
      })
      .catch(error => {
        console.error('Failed to fetch messages:', error);

        const errorEmbed = new EmbedBuilder()
          .setColor('#FFB800')
          .setDescription('An error occurred while fetching messages.');

        interaction.reply({ embeds: [errorEmbed], ephemeral: true });
      });
  },
};
