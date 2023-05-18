const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Submit a suggestion')
    .addStringOption((option) =>
      option.setName('content').setDescription('Enter your suggestion').setRequired(true)),

  async execute(interaction) {
    const suggestionContent = interaction.options.getString('content');
    const guildId = interaction.guild.id;

    db.get('SELECT channelId FROM suggestion_channels WHERE guildId = ?', [guildId], async (error, row) => {
      if (error) {
        console.error('Error fetching suggestion channel:', error);
        return interaction.reply({
          content: 'Failed to fetch the suggestion channel. Please try again later.',
          ephemeral: true,
        });
      }

      if (!row || !row.channelId) {
        return interaction.reply({
          content: 'The suggestion channel is not set up. Please use the `/suggestion-setup` command to set it up.',
          ephemeral: true,
        });
      }

      const suggestionChannelId = row.channelId;
      const suggestionChannel = interaction.guild.channels.cache.get(suggestionChannelId);

      if (!suggestionChannel) {
        return interaction.reply({
          content: 'The suggestion channel is not valid or accessible. Please check the configuration.',
          ephemeral: true,
        });
      }

      const suggestionEmbed = new EmbedBuilder()
        .setColor('#3f48cc')
        .setTitle('New Suggestion')
        .setDescription(suggestionContent)
        .setFooter({text: 'Vote with 👍 or 👎'});

      const suggestionMessage = await suggestionChannel.send({ embeds: [suggestionEmbed] });

      suggestionMessage.react('👍');
      suggestionMessage.react('👎');

      db.get('SELECT channelId FROM suggestion_logs WHERE guildId = ?', [guildId], async (logError, logRow) => {
        if (logError) {
          console.error('Error fetching suggestion log channel:', logError);
          return;
        }

        if (logRow && logRow.channelId) {
          const logChannelId = logRow.channelId;
          const logChannel = interaction.guild.channels.cache.get(logChannelId);

          if (logChannel) {
            const logEmbed = new EmbedBuilder()
              .setColor('#3f48cc')
              .setTitle('New Suggestion')
              .setDescription(suggestionContent)
              .setFooter({text: `Suggested by ${interaction.user.tag}`});

            logChannel.send({ embeds: [logEmbed] });
          } else {
            console.warn('The suggestion log channel is not valid or accessible. Please check the configuration.');
          }
        }
      });

      interaction.reply({
        content: 'Your suggestion has been submitted!',
        ephemeral: true,
      });
    });
  },
};
