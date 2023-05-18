const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// Open a SQLite database connection
const db = new sqlite3.Database('language.db');

db.run(`CREATE TABLE IF NOT EXISTS language_settings (user_id TEXT PRIMARY KEY, language TEXT)`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('language')
    .setDescription('Set the bot language')
    .addStringOption(option =>
      option.setName('language')
        .setDescription('Select the language')
        .setRequired(true)
        .addChoices({ name: 'English', value: 'en' })
        .addChoices({ name: 'Spanish', value: 'es' })),

  async execute(interaction) {
    const language = interaction.options.getString('language');
    const userId = interaction.user.id;

    db.run('REPLACE INTO language_settings (user_id, language) VALUES (?, ?)', [userId, language], (err) => {
      if (err) {
        console.error('Error updating language setting:', err);
        return interaction.reply('An error occurred while setting the language.');
      }
      console.log(`Language setting updated for user ${userId}: ${language}`);
      interaction.reply(`Bot language set to ${language}.`);
    });
  },
};
