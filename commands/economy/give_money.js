const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

const botDeveloperId = '1040357402647724082';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('givemoney')
    .setDescription('Give money to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to give money to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of money to give')
        .setRequired(true)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const senderId = interaction.user.id;

    if (senderId === botDeveloperId) {

        db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [amount, user.id], (err) => {
        if (err) {
          console.error('Error updating recipient balance in database:', err);
          return interaction.reply('An error occurred while giving money.');
        }

        interaction.reply(`Successfully gave ${amount} coins to ${user.username}.`);
      });
    } else {
      interaction.reply('This command is restricted to the bot developer.');
    }
  },
};
