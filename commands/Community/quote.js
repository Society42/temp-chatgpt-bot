const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3');

const quotes = {
  en: [
 { text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela' },
    { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
    { text: 'If life were predictable it would cease to be life, and be without flavor.', author: 'Eleanor Roosevelt' },
    { text: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' },
    { text: 'The best time to plant a tree was 20 years ago. The second best time is now.', author: 'Chinese Proverb' },
    { text: 'Spread love everywhere you go. Let no one ever come to you without leaving happier.', author: 'Mother Teresa' },
    { text: 'Don\'t judge each day by the harvest you reap but by the seeds that you plant.', author: 'Robert Louis Stevenson' },
    { text: 'The only limit to our realization of tomorrow will be our doubts of today.', author: 'Franklin D. Roosevelt' },
    { text: 'In the end, it\'s not the years in your life that count. It\'s the life in your years.', author: 'Abraham Lincoln' },
    { text: 'Life is either a daring adventure or nothing at all.', author: 'Helen Keller' },
    { text: 'Close your eyes. Focus on making yourself feel excited, powerful. Imagine yourself destroying goals with ease.', author: 'Andrew Tate' },
    { text: 'Freedom will only come when you no longer trade your time for money.', author: 'Andrew Tate' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill' },
    { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
    { text: 'Your time is limited, don\'t waste it living someone else\'s life.', author: 'Steve Jobs' },
    { text: 'The greatest glory in living lies not in never falling, but in rising every time we fall.', author: 'Nelson Mandela' },
    { text: 'If you set your goals ridiculously high and it\'s a failure, you will fail above everyone else\'s success.', author: 'James Cameron' },
    { text: 'Life is like riding a bicycle. To keep your balance, you must keep moving.', author: 'Albert Einstein' },
    { text: 'Success is always stressful.', author: 'Andrew Tate' },
    { text: 'The way to get started is to quit talking and begin doing.', author: 'Walt Disney' },
    { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt' },
    { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
    { text: 'Success is not final, failure is not fatal: It is the courage to continue that counts.', author: 'Winston Churchill' }
  ],
  es: [
    { text: 'La mayor gloria en la vida no es no caer, sino levantarnos cada vez que caemos.', author: 'Nelson Mandela' },
    { text: 'El camino para empezar es dejar de hablar y empezar a hacer.', author: 'Walt Disney' },
    { text: 'Si la vida fuera predecible, dejaría de ser vida y no tendría sabor', author: 'Eleanor Roosevelt' },
    { text: 'La vida es lo que sucede cuando estás ocupado haciendo otros planes', author: 'John Lennon' },
    { text: 'El mejor momento para plantar un árbol fue hace 20 años. El segundo mejor momento es ahora.', author: 'Proverbio chino' },
    { text: 'Difunde amor dondequiera que vayas. Que nadie venga a ti sin irse más feliz.', author: 'Madre Teresa' },
    { text: 'No juzgues cada día por la cosecha que cosechas, sino por las semillas que plantas.', author: 'Robert Louis Stevenson' },
    { text: 'El único límite para nuestra realización del mañana serán nuestras dudas de hoy.', author: 'Franklin D. Roosevelt' },
    { text: 'Al final, no son los años de tu vida los que cuentan. Es la vida en tus años.', author: 'Abraham Lincoln' },
    { text: 'La vida es una aventura audaz o nada en absoluto.', author: 'Helen Keller' },
    { text: 'Cierra los ojos. Concéntrese en sentirse emocionado, poderoso. Imagínate a ti mismo destruyendo goles con facilidad.', author: 'Andrew Tate' },
    { text: 'La libertad solo llegará cuando ya no intercambies tu tiempo por dinero', author: 'Andrew Tate' },
    { text: 'No importa lo lento que vayas mientras no te detengas', author: 'Confucio'},
    { text: 'El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje de continuar', author: 'Winston Churchill' },
    { text: 'Cree que puedes y estás a mitad de camino.', author: 'Theodore Roosevelt' },
    { text: 'Tu tiempo es limitado, no lo desperdicies viviendo la vida de otra persona', author: 'Steve Jobs' },
    { text: 'La mayor gloria de vivir no radica en no caer nunca, sino en levantarse cada vez que caemos', author: 'Nelson Mandela' },
    { text: 'Si establece metas ridículamente altas y es un fracaso, fracasará por encima del éxito de los demás', autor: 'James Cameron' },
    { text: 'La vida es como andar en bicicleta. Para mantener el equilibrio, debes seguir moviéndote.', author: 'Albert Einstein' },
    { text: 'El éxito siempre es estresante.', author: 'Andrew Tate' },
    { text: 'La forma de empezar es dejar de hablar y empezar a hacer.', author: 'Walt Disney' },
    { text: 'El futuro pertenece a aquellos que creen en la belleza de sus sueños.', author: 'Eleanor Roosevelt' },
    { text: 'No importa lo lento que vayas mientras no te detengas', author: 'Confucio'},
    { text: 'El éxito no es definitivo, el fracaso no es fatal: lo que cuenta es el coraje de continuar', author: 'Winston Churchill' }
  ],
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quote')
    .setDescription('Get a random quote of the day'),

  async execute(interaction, client) {
    const userId = interaction.user.id;
    const db = new sqlite3.Database('language.db');

    db.get('SELECT language FROM language_settings WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          console.error('Error retrieving language setting:', err);
          return interaction.reply('An error occurred while retrieving the language setting.');
        }

        const language = row ? row.language : 'en';
        const selectedQuotes = quotes[language] || quotes.en;

      const randomQuote = selectedQuotes[Math.floor(Math.random() * selectedQuotes.length)];

      const embed = new EmbedBuilder()
        .setColor('#3f48cc')
        .setTitle('Quote of the Day')
        .setDescription(randomQuote.text)
        .addFields({ name: 'Author', value: randomQuote.author });

      interaction.reply({ embeds: [embed] });
    });
  },
};
