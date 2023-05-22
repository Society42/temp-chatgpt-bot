const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Create a poll with multiple options')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('The question for the poll')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('options')
        .setDescription('The options for the poll (separated by commas)')
        .setRequired(true)),
  async execute(interaction) {
    // Check if the user has the MANAGE_MESSAGES permission
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      return interaction.reply({
        content: 'You do not have the required permissions to use this command.',
        ephemeral: true
      });
    }

    const question = interaction.options.getString('question');
    const options = interaction.options.getString('options').split(',');

    const embed = new EmbedBuilder()
      .setTitle('Poll')
      .setDescription(question)
      .setColor('#FFB800')
      .addFields({name: 'Options', value: options.map((option, index) => `${index + 1}. ${option}`).join('\n')});

    const pollMessage = await interaction.channel.send({ embeds: [embed] });
    options.forEach((_, index) => pollMessage.react(indexToEmoji(index)));

    function indexToEmoji(index) {
      const numberEmoji = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
      return numberEmoji[index];
    }
  },
};
