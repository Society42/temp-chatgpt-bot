const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('suggestion.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion-setup')
    .setDescription('Set up a suggestion system')
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select the channel for suggestions')
        .setRequired(true)),

  async execute(interaction) {
    const suggestionChannel = interaction.options.getChannel('channel');
    const guildId = interaction.guild.id;

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: 'You must be an administrator to set up the suggestion system.',
        ephemeral: true,
      });
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS suggestion_channels (
        guildId TEXT PRIMARY KEY,
        channelId TEXT
      )
    `, (error) => {
      if (error) {
        console.error('Error creating suggestion_channels table:', error);
      } else {
        console.log('suggestion_channels table created successfully!');
        
        db.run(`
          INSERT INTO suggestion_channels (guildId, channelId)
          VALUES (?, ?)
          ON CONFLICT(guildId) DO UPDATE SET channelId = excluded.channelId
        `, [guildId, suggestionChannel.id], (insertError) => {
          if (insertError) {
            console.error('Error saving suggestion channel:', insertError);
            return interaction.reply({
              content: 'Error setting up the suggestion system. Please try again.',
              ephemeral: true,
            });
          }

          interaction.reply({
            content: `Suggestion system is set up! Suggestions will be sent to ${suggestionChannel}`,
            ephemeral: true,
          });
        });
      }
    });
  },
};
