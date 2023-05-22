const { SlashCommandBuilder, EmbedBuilder, Intents } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays information about the server'),
  async execute(interaction) {
    const guild = interaction.guild;

    const client = interaction.client;
    const owner = await client.users.fetch(guild.ownerId);

    const name = guild.name;
    const ownerTag = owner ? owner.tag : 'Unknown';
    const memberCount = guild.memberCount;
    const boostCount = guild.premiumSubscriptionCount || 0;
    const createdAt = guild.createdAt.toDateString();
    const serverImage = guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png'; 

    const serverInfoEmbed = new EmbedBuilder()
      .setColor('#FFB800')
      .setTitle('Server Information')
      .setThumbnail(serverImage)
      .addFields(
        { name: 'Server Name', value: name, inline: true },
        { name: 'Owner', value: ownerTag, inline: true },
        { name: 'Member Count', value: memberCount.toString(), inline: true },
        { name: 'Boost Count', value: boostCount.toString(), inline: true },
        { name: 'Created At', value: createdAt, inline: true }
      )

    await interaction.reply({ embeds: [serverInfoEmbed] });
  },
};
