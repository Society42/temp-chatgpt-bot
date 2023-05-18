const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changename')
    .setDescription('Change the bot\'s name (devs only)')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The new name for the bot')
        .setRequired(true)),

  async execute(interaction, client) {
    const { options } = interaction;
    const newName = options.getString('name');

    const devs = new EmbedBuilder()
      .setColor("#3f48cc")
      .setTitle('Change Name Command')
      .setDescription('This command is only for the devs of this bot.')
      .setFooter({ text: "Powered by EchoBot", iconURL: "https://media.discordapp.net/attachments/1043952624703123557/1106512571537834036/EchoBotLogo.png?width=604&height=604" });

    if (interaction.user.id !== "1040357402647724082") {
      return await interaction.reply({ embeds: [devs] });
    } else {
      try {
        // Change the bot's name
        await client.user.setUsername(newName);

        const embed = new EmbedBuilder()
          .setColor("#ffaec8")
          .setTitle('Change Name Command')
          .setDescription(`:white_check_mark: The bot's name has been changed to \`${newName}\``)
          .setFooter({ text: "Powered by EchoBot", iconURL: "https://media.discordapp.net/attachments/1043952624703123557/1106512571537834036/EchoBotLogo.png?width=604&height=604" });

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Error changing bot name:', error);
        return interaction.reply('An error occurred while changing the bot name.');
      }
    }
  },
};
