const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const translateCommand = new SlashCommandBuilder()
  .setName('translate')
  .setDescription('Translate text to another language.')
  .addStringOption(option => option.setName('text').setDescription('The text to translate.').setRequired(true))
  .addStringOption(option => option.setName('target').setDescription('The target language for translation.').setRequired(true));

module.exports = {
  data: translateCommand,
  async execute(interaction) {
    const text = interaction.options.getString('text');
    const target = interaction.options.getString('target');

    try {
      // Perform the translation
      const translate = await import('translate');
      translate.engine = 'libre';
      translate.from = 'auto';
      const translation = await translate.default(text, { to: target });

      // Build the embed message
      const embed = new EmbedBuilder()
        .setColor('#3f48cc')
        .setTitle('Text Translation')
        .addFields(
            { name: 'Original Text', value: text },
            { name: 'Translation', value: translation },
        );
        
      await interaction.reply({ embeds: [embed] });
    } catch (e) {
      console.error(e);
      await interaction.reply('Failed to translate the text.');
    }
  },
};
