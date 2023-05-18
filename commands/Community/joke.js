const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const jokes = {
  en: [
    "Why don't scientists trust atoms? Because they make up everything!",
    "Why don't skeletons fight each other? They don't have the guts!",
    "I'm reading a book about anti-gravity. It's impossible to put down!",
    "Why don't scientists trust atoms? Because they make up everything!",
    "Did you hear about the mathematician who's afraid of negative numbers? He will stop at nothing to avoid them!",
    "Why did the scarecrow win an award? Because he was outstanding in his field!",
    "Why did the bicycle fall over? Because it was two-tired!",
    "What do you call a fish with no eyes? Fsh!",
    "Why don't eggs tell jokes? Because they might crack up!",
    "Why don't some couples go to the gym? Because some relationships don't work out!",
    "What do you get if you cross a snowman and a vampire? Frostbite!",
    "What do you call a bear with no teeth? A gummy bear!",
    "Why did the tomato turn red? Because it saw the salad dressing!",
    "How do you organize a space party? You planet!",
    "What did one wall say to the other wall? I'll meet you at the corner!",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one!",
    "Why don't melons get married? Because they can'taloupe!",
    "Why did the cookie go to the doctor? It was feeling crumby!",
    "What do you call a can opener that doesn't work? A can't opener!",
    "What do you call a snowman with a six-pack? An abdominal snowman!",
  ],
  es: [
    "¿Por qué los científicos no confían en los átomos? ¡Porque lo componen todo!",
    "¿Por qué los esqueletos no pelean entre sí? ¡No tienen agallas!",
    "Estoy leyendo un libro sobre la gravedad. ¡Es imposible dejarlo!",
    "¿Por qué los científicos no confían en los átomos? ¡Porque lo componen todo!",
    "¿Sabías que los matemáticos no temen a los números negativos? Harán lo imposible para evitarlos.",
    "¿Por qué el espantapájaros ganó un premio? ¡Porque era excelente en su campo!",
    "¿Por qué se cayó la bicicleta? ¡Porque estaba cansada!",
    "¿Cómo llamas a un pez sin ojos? ¡Fsh!",
    "¿Por qué los huevos no cuentan chistes? ¡Porque podrían romperse de risa!",
    "¿Sabes por qué algunas parejas no van al gimnasio? ¡Porque algunas relaciones no funcionan!",
    "¿Qué obtienes si cruzas un muñeco de nieve y un vampiro? ¡Congelación!",
    "¿Cómo se llama un oso sin dientes? ¡Un oso gomoso!",
    "¿Por qué el tomate se puso rojo? ¡Porque vio el aderezo para ensaladas!",
    "¿Cómo organizas una fiesta espacial? ¡Planetas!",
    "¿Qué le dijo una pared a la otra? Nos vemos en la esquina.",
    "¿Por qué el golfista llevó dos pantalones? ¡Por si le hacía un hoyo en uno!",
    "¿Por qué los melones no se casan? ¡Porque no puedenelop!",
    "¿Por qué la galleta fue al médico? Se sentía hecha migajas.",
    "¿Cómo se llama un abrelatas que no funciona? ¡Un abre-no-puedo!",
    "¿Cómo se llama un muñeco de nieve con un six-pack? ¡Un muñeco abdominal!",
  ],
};

// Open a SQLite database connection
const db = new sqlite3.Database('language.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Tell a random joke!'),

  async execute(interaction) {
    const userId = interaction.user.id;

    // Retrieve the language setting from the database
    db.get('SELECT language FROM language_settings WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        console.error('Error retrieving language setting:', err);
        return interaction.reply('An error occurred while retrieving the language setting.');
      }

      const language = row ? row.language : 'en'; // Default to English if no language setting found
      const selectedJokes = jokes[language] || jokes.en;

      const randomIndex = Math.floor(Math.random() * selectedJokes.length);
      const joke = selectedJokes[randomIndex];

      const embed = new EmbedBuilder()
        .setColor('#3f48cc')
        .setTitle('Random Joke')
        .setDescription(joke);

      interaction.reply({ embeds: [embed] });
    });
  },
};
