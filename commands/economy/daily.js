const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

const giftCooldown = 24 * 60 * 60 * 1000; 

module.exports = {
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Claim your daily gift'),

  async execute(interaction) {
    const userId = interaction.user.id;

    db.get('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, userRow) => {
      if (err) {
        console.error('Error retrieving user account from database:', err);
        return interaction.reply('An error occurred while processing your daily gift.');
      }

      if (!userRow) {
        return interaction.reply('You need to create an account first.');
      }

      const currentTime = Date.now();
      const lastGiftTime = userRow.last_gift_time || 0;

      if (currentTime - lastGiftTime < giftCooldown) {
        const remainingTime = giftCooldown - (currentTime - lastGiftTime);
        const remainingHours = Math.floor(remainingTime / (60 * 60 * 1000));
        const remainingMinutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));
        const remainingSeconds = Math.floor((remainingTime % (60 * 1000)) / 1000);

        const embed = new EmbedBuilder()
          .setColor('#85bb65')
          .setTitle('Daily Gift')
          .setDescription(`You have already claimed your daily gift.\nPlease wait ${remainingHours} hours, ${remainingMinutes} minutes, and ${remainingSeconds} seconds.`)
          .setTimestamp()
          .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

        return interaction.reply({ embeds: [embed] });
      }

      const receivedAmount = Math.floor(Math.random() * (100 - 50 + 1)) + 50;

      db.run('UPDATE accounts SET balance = balance + ?, last_gift_time = ? WHERE user_id = ?', [receivedAmount, currentTime, userId], (err) => {
        if (err) {
          console.error('Error updating user balance in database:', err);
          return interaction.reply('An error occurred while processing your daily gift.');
        }

        const embed = new EmbedBuilder()
          .setColor('#85bb65')
          .setTitle('Daily Gift')
          .setDescription(`Congratulations! You claimed your daily gift and received ${receivedAmount} coins.`)
          .setTimestamp()
          .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});


        interaction.reply({ embeds: [embed] });
      });
    });
  },
};
