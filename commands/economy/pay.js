const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Transfer money to another user')
    .addUserOption(option =>
      option.setName('recipient')
        .setDescription('The user you want to send money to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of money to send')
        .setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const recipient = interaction.options.getUser('recipient');
    const amount = interaction.options.getInteger('amount');

    if (amount <= 0) {
      return interaction.reply('The amount must be greater than 0.');
    }

    db.get('SELECT balance FROM accounts WHERE user_id = ?', [userId], (err, senderRow) => {
      if (err) {
        console.error('Error retrieving sender balance from database:', err);
        return interaction.reply('An error occurred while retrieving your account balance.');
      }

      if (!senderRow || senderRow.balance < amount) {
        return interaction.reply('You do not have enough balance to make this transfer.');
      }

      db.run('UPDATE accounts SET balance = balance - ? WHERE user_id = ?', [amount, userId], (err) => {
        if (err) {
          console.error('Error updating sender balance in database:', err);
          return interaction.reply('An error occurred while making the transfer.');
        }

        db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [amount, recipient.id], (err) => {
          if (err) {
            console.error('Error updating recipient balance in database:', err);
            return interaction.reply('An error occurred while making the transfer.');
          }

          const embed = new EmbedBuilder()
            .setColor('#85bb65')
            .setDescription(`Successfully transferred ${amount} coins to ${recipient.username}.`)
            .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});


          interaction.reply({ embeds: [embed] });
        });
      });
    });
  },
};
