const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('casino')
    .setDescription('Gamble your money')
    .addIntegerOption(option => option.setName('amount').setDescription('The amount of money to gamble').setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0) {
      return interaction.reply('Invalid amount. You must gamble at least 1 coin.');
    }

    db.get('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, userRow) => {
      if (err) {
        console.error('Error retrieving user account from database:', err);
        return interaction.reply('An error occurred while gambling.');
      }

      if (!userRow) {
        return interaction.reply('You need to create an account first.');
      }

      const currentBalance = userRow.balance;

      if (amount > currentBalance) {
        return interaction.reply('You do not have enough money to gamble that amount.');
      }

      const winChance = 0.5;
      const won = Math.random() < winChance;
      const wonAmount = won ? amount : -amount;

      db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [wonAmount, userId], (err) => {
        if (err) {
          console.error('Error updating user balance in database:', err);
          return interaction.reply('An error occurred while gambling.');
        }

        const resultMessage = won ? `Congratulations! You won ${amount} coins!` : `Oops! You lost ${amount} coins!`;
        const newBalance = currentBalance + wonAmount;

        const embed = new EmbedBuilder()
          .setColor(won ? '#85bb65' : '#85bb65')
          .setTitle('Gambling Result')
          .setDescription(resultMessage)
          .addFields(
            { name: 'Amount Gambled', value: amount.toString() },
            { name: 'New Balance', value: newBalance.toString() }
          )
          .setTimestamp()
          .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

        return interaction.reply({ embeds: [embed] });
      });
    });
  },
};
