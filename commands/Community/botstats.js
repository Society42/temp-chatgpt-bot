const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { version: discordVersion } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botstats')
    .setDescription('Display bot statistics'),

  async execute(interaction, client) {
    const botUser = await client.users.fetch(client.user.id);

    const totalGuilds = client.guilds.cache.size;
    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('Bot Statistics')
      .addFields(
        { name: 'Bot Name', value: botUser.username },
        { name: 'Bot Version', value: discordVersion },
        { name: 'Total Users', value: totalUsers.toString() },
        { name: 'Total Guilds', value: totalGuilds.toString() }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
