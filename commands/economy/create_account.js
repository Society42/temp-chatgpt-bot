const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

db.run(`
  CREATE TABLE IF NOT EXISTS accounts (
    user_id TEXT PRIMARY KEY,
    guild_id TEXT,
    balance INTEGER DEFAULT 0,
    last_gift_time INTEGER DEFAULT 0
  )
`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-account')
    .setDescription('Create an account'),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id; 

    db.run('INSERT OR IGNORE INTO accounts (user_id, guild_id) VALUES (?, ?)', [userId, guildId], (err) => {
      if (err) {
        console.error('Error creating user account in database:', err);
        return interaction.reply('An error occurred while creating your account.');
      }

      const embed = new EmbedBuilder()
        .setColor('#85bb65')
        .setTitle('Account Creation')
        .setDescription('Your account has been created successfully!')
        .setTimestamp()
        .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

      return interaction.reply({ embeds: [embed] });
    });
  },
};
