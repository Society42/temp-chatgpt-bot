const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

db.run(`
  CREATE TABLE IF NOT EXISTS guilds (
    guild_id TEXT PRIMARY KEY,
    name TEXT,
    status TEXT
  )
`);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your account balance'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Retrieve the user's balance from the database
    db.get('SELECT balance FROM accounts WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        console.error('Error retrieving balance from database:', err);
        return interaction.reply('An error occurred while retrieving your account balance.');
      }

      if (!row) {
        return interaction.reply('You do not have an account. Use the `createaccount` command to create one.');
      }

      const balance = row.balance;

      const embed = new EmbedBuilder()
        .setColor('#85bb65')
        .setTitle('Account Balance')
        .setDescription(`Your account balance is: ${balance}`)
        .setTimestamp()
        .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

      return interaction.reply({ embeds: [embed] });
    });
  },
};
