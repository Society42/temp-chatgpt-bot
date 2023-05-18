const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

// Array of questions
const questions = {
  en: [
    'What is your favorite book?',
    'If you could have any superpower, what would it be?',
    'What is your favorite hobby?',
    'What is the most adventurous thing you have ever done?',
    'If you could travel anywhere in the world, where would you go?',
    'What is your favorite food?',
    'What is your dream job?',
    'What is one thing you can\'t live without?',
    'If you could have dinner with any historical figure, who would it be?',
    'What is your favorite movie of all time?',
  ],
  es: [
    '¿Cuál es tu libro favorito?',
    'Si pudieras tener cualquier superpoder, ¿cuál sería?',
    '¿Cuál es tu pasatiempo favorito?',
    '¿Cuál es la cosa más aventurera que has hecho?',
    'Si pudieras viajar a cualquier parte del mundo, ¿a dónde irías?',
    '¿Cuál es tu comida favorita?',
    '¿Cuál es tu trabajo soñado?',
    '¿Qué es una cosa sin la que no podrías vivir?',
    'Si pudieras cenar con cualquier figura histórica, ¿quién sería?',
    '¿Cuál es tu película favorita de todos los tiempos?',
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qotd')
    .setDescription('Get the Question of the Day'),

  async execute(interaction, client) {
    // Retrieve user's language from the SQLite database
    const userId = interaction.user.id;
    const db = new sqlite3.Database('language.db');

    db.get('SELECT language FROM language_settings WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          console.error('Error retrieving language setting:', err);
          return interaction.reply('An error occurred while retrieving the language setting.');
        }

      const language = row ? row.language : 'en';
      const selectedQuestions = questions[language] || questions.en;

      // Select a random question from the array
      const randomQuestion = selectedQuestions[Math.floor(Math.random() * selectedQuestions.length)];

      // Create an embed with the question
      const embed = new EmbedBuilder()
        .setColor('#3f48cc')
        .setTitle('Question of the Day')
        .setDescription(randomQuestion);

      interaction.reply({ embeds: [embed] });
    });
  },
};
