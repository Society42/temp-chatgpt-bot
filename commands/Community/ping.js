const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s ping to the server'),
  async execute(interaction) {
    const start = Date.now();
    const message = await interaction.reply({ content: 'Pinging...' });
    const end = Date.now();
    const ping = end - start;

    const embed = new EmbedBuilder()
      .setTitle('Pong!')
      .addFields({name: 'Bot Latency', value: `${ping}ms`})
      .addFields({name: 'API Latency', value: `${interaction.client.ws.ping}ms`})
      .setColor('#FFB800');

    await message.edit({ content: ' ', embeds: [embed] });
  },
};
