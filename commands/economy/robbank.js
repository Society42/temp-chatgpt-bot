const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('robbank')
    .setDescription('Attempt to rob a bank'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Simulate the bank robbery
    const success = Math.random() < 0.5; // 50% chance of success
    const stolenAmount = success ? Math.floor(Math.random() * (1000 - 100 + 1)) + 100 : 0;

    // Update the user's balance accordingly
    db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [stolenAmount, userId], (err) => {
      if (err) {
        console.error('Error updating user balance in database:', err);
        return interaction.reply('An error occurred while robbing the bank.');
      }

      const embed = new EmbedBuilder();

      if (success) {
        embed.setColor('#85bb65')
          .setDescription(`You successfully robbed the bank and stole ${stolenAmount} coins!`)
          .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});
      } else {
        embed.setColor('#85bb65')
          .setDescription('Your bank robbery attempt failed. Better luck next time!')
          .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});
      }

      interaction.reply({ embeds: [embed] });
    });
  },
};
