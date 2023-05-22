const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays information about a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get information about')
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    const username = user.username;
    const discriminator = user.discriminator;
    const avatarURL = user.displayAvatarURL({ dynamic: true });
    const createdAt = user.createdAt.toDateString();
    const userFlags = user.flags.toArray().join(', ');

    const userInfoEmbed = new EmbedBuilder()
      .setColor('#FFB800')
      .setTitle('User Information')
      .setThumbnail(avatarURL)
      .addFields(
        { name: 'Username', value: `${username}#${discriminator}`, inline: true },
        { name: 'User ID', value: user.id, inline: true },
        { name: 'Account Created', value: createdAt, inline: true },
        { name: 'Flags', value: userFlags || 'None', }
      )

    await interaction.reply({ embeds: [userInfoEmbed] });
  },
};
