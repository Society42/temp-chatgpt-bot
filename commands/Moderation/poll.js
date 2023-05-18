const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Enter the poll question')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('options')
        .setDescription('Enter poll options, separated by commas')
        .setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');
    const options = interaction.options.getString('options').split(',');

    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('📊 Poll')
      .setDescription(question)
      .addFields(
        options.map((option, index) => ({
          name: `${index + 1}.`,
          value: option,
        }))
      )
      .setFooter({text: `Poll created by ${interaction.user.tag}`, value: interaction.user.displayAvatarURL()});

      const reply = await interaction.deferReply();
      const pollMessage = await interaction.followUp({ embeds: [embed] });
      await pollMessage.react('👍');
      await pollMessage.react('👎');
  },
};
