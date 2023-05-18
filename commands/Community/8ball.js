const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Array of 8ball responses
const responses = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Ask the 8ball a question')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The yes/no question to ask')
        .setRequired(true)
    ),

  async execute(interaction) {
    const question = interaction.options.getString('question');

    const randomIndex = Math.floor(Math.random() * responses.length);
    const response = responses[randomIndex];

    const { user } = interaction;
    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('8ball')
      .addFields({name: 'Question', value: question})
      .addFields({name: 'Response', value: response})
      .setFooter(`Asked by ${user.username}`, user.avatarURL());

    // Send the embed as a reply
    await interaction.reply({ embeds: [embed] });
  },
};
