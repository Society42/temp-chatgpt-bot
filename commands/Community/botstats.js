const { SlashCommandBuilder } = require('@discordjs/builders');
const { version: discordVersion, EmbedBuilder } = require('discord.js');
const { version: botVersion, uptime, memoryUsage } = require('process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botstats')
    .setDescription('Get statistics about the bot'),
  execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('#FFB800')
      .setTitle('Bot Statistics')
      .addFields({name: 'Bot Version', value: botVersion, inline: true})
      .addFields({name: 'Discord.js Version', value: discordVersion, inline: true})
      .addFields({name: 'Uptime', value: formatUptime(uptime()), inline: true})
      .addFields({name: 'Memory Usage', value: formatMemoryUsage(memoryUsage().heapUsed), inline: true});

    interaction.reply({ embeds: [embed] });
  },
};

function formatUptime(ms) {
  const days = Math.floor(ms / 86400000);
  const hours = Math.floor((ms / 3600000) % 24);
  const minutes = Math.floor((ms / 60000) % 60);
  const seconds = Math.floor((ms / 1000) % 60);

  return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function formatMemoryUsage(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;

  for (let i = 0; i < units.length; i++) {
    if (value < 1024 || i === units.length - 1) {
      return `${value.toFixed(2)} ${units[i]}`;
    }
    value /= 1024;
  }
}
