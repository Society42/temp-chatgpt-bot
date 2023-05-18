const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get a list of available commands'),

  async execute(interaction) {

    const embed = new EmbedBuilder()
      .setColor('#85bb65')
      .setTitle('Command List')
      .setDescription('Here are the available commands:')
      .addFields({name: '1. /createaccount', value: 'Creates an economy acount'})
      .addFields({name: '2. /deleteaccount', value: 'Deletes an economy acount'})
      .addFields({name: '3. /balance', value: 'Check your current balance'})
      .addFields({name: '4. /leaderboard', value: 'View the leaderboard of users'})
      .addFields({name: '5. /global-leaderboard', value: 'View the global leaderboard across all servers'})
      .addFields({name: '6. /beg', value: 'Beg for coins'})
      .addFields({name: '7. /work', value: 'Work to earn coins'})
      .addFields({name: '8. /daily', value: 'Claim your daily coins'})
      .addFields({name: '9. /casino', value: 'Try your luck at the casino'})
      .addFields({name: '10. /robbank', value: 'Rob a bank'})
      .addFields({name: '11. /rob', value: 'Rob money from another user on the server'})
      .addFields({name: '12. /help', value: 'Get a list of available commands'})
      .setTimestamp()
      .setFooter({text: 'EchoEconomy', iconURL: 'https://media.discordapp.net/attachments/1043952624703123557/1108103739870548088/EchoEconomy.png'});


    return interaction.reply({ embeds: [embed] });
  },
};