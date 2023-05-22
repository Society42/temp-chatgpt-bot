const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Get a random meme'),
  async execute(interaction) {
    try {
      const response = await fetch('https://www.reddit.com/r/memes/random/.json');
      const data = await response.json();
      const meme = data[0].data.children[0].data;

      if (!meme || !meme.title || !meme.url_overridden_by_dest || !meme.author) {
        throw new Error('Failed to fetch meme data.');
      }

      const embed = new EmbedBuilder()
        .setColor('#FFB800')
        .setTitle(meme.title)
        .setImage(meme.url_overridden_by_dest)
        .setFooter(`Posted by u/${meme.author}`);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to fetch meme:', error);
      await interaction.reply({ content: 'An error occurred while fetching a meme.', ephemeral: true });
    }
  },
};
