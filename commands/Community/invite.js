const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Invite the bot to your server'),
  async execute(interaction) {
    const botClientId = interaction.client.user.id;
    const inviteLink = `https://discord.com/oauth2/authorize?client_id=${botClientId}&scope=bot&permissions=0`;

    const embed = new EmbedBuilder()
      .setColor('#FFB800')
      .setTitle('Invite the Bot')
      .setDescription(`You can invite the bot to your server using this [Invite Link](${inviteLink})`);

    interaction.reply({ embeds: [embed] });
  },
};
