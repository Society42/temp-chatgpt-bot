const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rob')
    .setDescription('Attempt to rob another user')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('User to rob')
        .setRequired(true)),

  async execute(interaction) {
    const userId = interaction.user.id;
    const targetId = interaction.options.getUser('target').id;

    if (userId === targetId) {
      return interaction.reply('You cannot rob yourself.');
    }

    db.get('SELECT * FROM accounts WHERE user_id = ?', [userId], (err, userRow) => {
      if (err) {
        console.error('Error retrieving user account from database:', err);
        return interaction.reply('An error occurred while attempting to rob.');
      }

      if (!userRow) {
        return interaction.reply('You need to create an account first.');
      }

      db.get('SELECT * FROM accounts WHERE user_id = ?', [targetId], (err, targetRow) => {
        if (err) {
          console.error('Error retrieving target account from database:', err);
          return interaction.reply('An error occurred while attempting to rob.');
        }

        if (!targetRow) {
          return interaction.reply('The target user does not have an account.');
        }

        const successChance = Math.random();

        if (successChance < 0.5) {
          const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setDescription('You failed to rob the user. Better luck next time!');

          return interaction.reply({ embeds: [embed] });
        }

        const stealAmount = Math.floor(Math.random() * (targetRow.balance * 0.75 - targetRow.balance * 0.5 + 1)) + targetRow.balance * 0.5;

        db.run('UPDATE accounts SET balance = balance + ? WHERE user_id = ?', [stealAmount, userId], (err) => {
          if (err) {
            console.error('Error updating user balance in database:', err);
            return interaction.reply('An error occurred while attempting to rob.');
          }

          db.run('UPDATE accounts SET balance = balance - ? WHERE user_id = ?', [stealAmount, targetId], (err) => {
            if (err) {
              console.error('Error updating target balance in database:', err);
              return interaction.reply('An error occurred while attempting to rob.');
            }

            const embed = new EmbedBuilder()
              .setColor('#85bb65')
              .setDescription(`You successfully robbed ${stealAmount} coins from the target user!`)
              .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});


            interaction.reply({ embeds: [embed] });
          });
        });
      });
    });
  },
};
