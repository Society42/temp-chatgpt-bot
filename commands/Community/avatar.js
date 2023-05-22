const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Get the avatar of a user')
    .addUserOption(option => option.setName('user').setDescription('Select a user').setRequired(true)),
  execute(interaction) {
    const user = interaction.options.getUser('user');
    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new EmbedBuilder()
      .setColor('#FFB800')
      .setTitle(`Avatar of ${user.tag}`)
      .setImage(avatarUrl);

    interaction.reply({ embeds: [embed] });
  },
};
