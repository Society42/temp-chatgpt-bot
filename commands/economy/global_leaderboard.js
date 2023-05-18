const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./economy.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('global-leaderboard')
    .setDescription('Show the top users from every server based on their balance'),

  async execute(interaction) {
    // Retrieve the top 10 users based on their balance from all servers
    db.all('SELECT user_id, SUM(balance) AS total_balance FROM accounts GROUP BY user_id ORDER BY total_balance DESC LIMIT 10', (err, rows) => {
      if (err) {
        console.error('Error retrieving global leaderboard from database:', err);
        return interaction.reply('An error occurred while retrieving the global leaderboard.');
      }

      if (rows.length === 0) {
        return interaction.reply('The global leaderboard is currently empty.');
      }

      const embed = new EmbedBuilder()
        .setColor('#85bb65')
        .setTitle('Global Leaderboard')
        .setDescription('Top users from every server based on their balance')
        .setTimestamp()
        .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});

      rows.forEach((row, index) => {
        embed.addFields({name: `#${index + 1}`, value: `<@${row.user_id}> with ${row.total_balance} coins`, inline: false});
      });

      interaction.reply({ embeds: [embed] });
    });
  },
};
