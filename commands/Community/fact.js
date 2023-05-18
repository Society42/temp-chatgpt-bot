const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// Array of random facts
const facts = [
  'A single cloud can weigh more than 1 million pounds.',
  'The world\'s oldest known living tree is over 5,000 years old.',
  'Honey never spoils. You can eat honey that\'s been stored for thousands of years.',
  'The average person spends 6 months of their lifetime waiting for red lights to turn green.',
  'There are more possible iterations of a game of chess than there are atoms in the known universe.',
  'Cows have best friends and can become stressed when they are separated.',
  'The shortest war in history lasted only 38 to 45 minutes.',
  'The average person walks the equivalent of three times around the world in a lifetime.',
  'The Eiffel Tower can be 15 cm taller during the summer due to thermal expansion.',
  'A flock of crows is known as a murder.',
  'Polar bears have black skin to help them absorb and retain heat from the sun.',
  'Octopuses have three hearts.',
  'The world\'s quietest room is located at Microsoft\'s headquarters and is so quiet that you can hear your own blood flowing.',
  'The first oranges weren\'t orange. They were green.',
  'The shortest war in history was between Zanzibar and England in 1896. Zanzibar surrendered after 38 minutes.',
  'The average person blinks around 15 to 20 times per minute.',
  'Giraffes have the same number of neck vertebrae as humans: seven.',
  'The world\'s oldest known recipe is a beer recipe from ancient Sumeria, about 4,000 years old.',
  'Ants never sleep and don\'t have lungs.',
  'A group of flamingos is called a flamboyance.',
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fact')
    .setDescription('Get a random fact'),

  async execute(interaction, client) {

    const randomFact = facts[Math.floor(Math.random() * facts.length)];

    const embed = new EmbedBuilder()
      .setColor('#3f48cc')
      .setTitle('Random Fact')
      .setDescription(randomFact);

    await interaction.reply({ embeds: [embed] });
  },
};
