const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const questions = [
  "Would you rather have super strength or super speed?",
  "Would you rather be able to fly or be invisible?",
  "Would you rather always speak your mind or never speak again?",
  "Would you rather live in the mountains or by the beach?",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wouldyourather')
    .setDescription('Ask a "Would You Rather" question'),

  async execute(interaction) {

    const randomIndex = Math.floor(Math.random() * questions.length);
    const question = questions[randomIndex];

    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('Would You Rather')
      .setDescription(question);

    await interaction.reply({ embeds: [embed] });
  },
};
