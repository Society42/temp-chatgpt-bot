const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('database.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggestion-log')
    .setDescription('Set up a log system for suggestions')
    .addChannelOption((option) =>
      option.setName('channel')
        .setDescription('Select the channel for suggestion logs')
        .setRequired(true)),

  async execute(interaction) {
    const logChannel = interaction.options.getChannel('channel');

    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply({
        content: 'You must be an administrator to set up the suggestion log system.',
        ephemeral: true,
      });
    }

    db.run(`
      CREATE TABLE IF NOT EXISTS suggestion_logs (
        guildId TEXT PRIMARY KEY,
        channelId TEXT
      )
    `, (error) => {
      if (error) {
        console.error('Error creating suggestion_logs table:', error);
      } else {
        console.log('suggestion_logs table created successfully!');
      }

      db.run('INSERT OR REPLACE INTO suggestion_logs (guildId, channelId) VALUES (?, ?)', [interaction.guild.id, logChannel.id], (insertError) => {
        if (insertError) {
          console.error('Error saving suggestion log channel:', insertError);
          return interaction.reply({
            content: 'Failed to save the suggestion log channel. Please try again later.',
            ephemeral: true,
          });
        }

        interaction.reply({
          content: `Suggestion log system is set up! Suggestions will be logged in ${logChannel}.`,
          ephemeral: true,
        });
      });
    });
  },
};
