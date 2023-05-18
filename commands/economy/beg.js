const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('beg')
    .setDescription('Beg for money'),

  async execute(interaction) {
    const userId = interaction.user.id;

    db.get('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, userRow) => {
      if (err) {
        console.error('Error retrieving user account from database:', err);
        return interaction.reply('An error occurred while begging for money.');
      }

      if (!userRow) {
        return interaction.reply('You do not have an account. Use the `createaccount` command to create one.');
      }


      // Define the chance of not receiving any money (e.g., 30% chance)
      const noMoneyChance = 0.3;

      // Generate a random number between 0 and 1
      const random = Math.random();

      let receivedAmount = 0;
      let description = '';

      if (random > noMoneyChance) {
        // If the random number is greater than the chance, receive money
        receivedAmount = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [receivedAmount, userId], (err) => {
          if (err) {
            console.error('Error updating user balance in database:', err);
            return interaction.reply('An error occurred while begging for money.');
          }

          description = `You begged and received ${receivedAmount} coins!`;

          const embed = new EmbedBuilder()
            .setColor('#85bb65')
            .setTitle('Begging Result')
            .setDescription(description)
            .setTimestamp()
            .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

          interaction.reply({ embeds: [embed] });
        });
      } else {
        description = 'You begged but received nothing. Better luck next time!';

        const embed = new EmbedBuilder()
          .setColor('#85bb65')
          .setTitle('Begging Result')
          .setDescription(description)
          .setTimestamp()
          .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

        interaction.reply({ embeds: [embed] });
      }
    });
  },
};
