const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-account')
    .setDescription('Delete your account'),

  async execute(interaction) {
    const userId = interaction.user.id;

    db.run('DELETE FROM accounts WHERE user_id = ?', [userId], (err) => {
      if (err) {
        console.error('Error deleting user account from database:', err);
        return interaction.reply('An error occurred while deleting your account.');
      }
      

      const embed = new EmbedBuilder()
        .setColor('#85bb65')
        .setDescription('Your account has been successfully deleted.')
        .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});


      interaction.reply({ embeds: [embed] });
    });
  },
};
