const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('membercount')
    .setDescription('Show the total number of members in the server'),
  async execute(interaction) {
    const memberCount = interaction.guild.memberCount;

    const embed = new EmbedBuilder()
      .setColor('#FFB800')
      .setTitle('Member Count')
      .setDescription(`The server has a total of ${memberCount} members.`);

    await interaction.reply({ embeds: [embed] });
  },
};
