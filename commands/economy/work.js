const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('work')
    .setDescription('Work and earn money'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Simulate work and earn money
    const earnedAmount = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

    // Update the user's balance accordingly
    db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [earnedAmount, userId], (err) => {
      if (err) {
        console.error('Error updating user balance in database:', err);
        return interaction.reply('An error occurred while working.');
      }

      const embed = new EmbedBuilder()
        .setColor('#85bb65')
        .setDescription(`You worked and earned ${earnedAmount} coins!`)
        .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

      interaction.reply({ embeds: [embed] });
    });
  },
};
