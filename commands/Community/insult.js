const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const insults = [
  "You're as useless as the 'g' in lasagna.",
  "If you were a vegetable, you'd be a 'cute-cumber'.",
  "Is your ass jealous of the amount of shit that comes out of your mouth?",
  "You have an entire life to be a jerk. Why not take today off?",
  "I'm not saying I hate you, but I would unplug your life support to charge my phone.",
  "You're the reason the gene pool needs a lifeguard.",
  "Some people should use glue stick instead of Chapstick.",
  "I envy people who have never met you.",
  "Roses are red, violets are blue, I have five fingers, and the middle one is for you.",
  "If laughter is the best medicine, your face must be curing the world.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('insult')
    .setDescription('Insult someone')
    .addUserOption(option => option.setName('user').setDescription('User to insult').setRequired(true)),
    
  execute(interaction) {
    const user = interaction.options.getUser('user');
    const randomInsult = insults[Math.floor(Math.random() * insults.length)];
    
    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('Insult')
      .setDescription(`${user}, ${randomInsult}`);
    
    interaction.reply({ embeds: [embed] });
  },
};
