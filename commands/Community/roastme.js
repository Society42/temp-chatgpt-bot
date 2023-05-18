const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const sqlite3 = require('sqlite3');

const roasts = {
    en: [
        "You're so ugly, when you look in the mirror, your reflection looks away.",
        "I'm jealous of people who don't know you.",
        "Your face makes onions cry.",
        "If laughter is the best medicine, your face must be curing the world.",
        "I'd roast you, but my mom said I'm not allowed to burn trash.",
        "Is your ass jealous of the amount of shit that comes out of your mouth?",
        "You're so dumb, you tried to climb Mountain Dew.",
        "I'm not saying I hate you, but I would unplug your life support to charge my phone.",
        "You have enough fat to make another human.",
        "If stupidity was a profession, you'd be a billionaire.",
        "You're the reason God created the middle finger.",
        "If I wanted to kill myself, I'd climb your ego and jump to your IQ.",
        "Your family tree must be a cactus because everybody on it is a prick.",
        "I'm sorry, was I supposed to be offended? The only thing that offends me is your face.",
        "I bet your brain feels as good as new, since you never use it.",
        "If you're going to be two-faced, at least make one of them pretty.",
        "It's a shame you can't Photoshop your personality.",
        "I'm not insulting you, I'm describing you.",
        "It's better to let someone think you're an idiot than to open your mouth and prove it.",
        "Roses are red, violets are blue, I have five fingers, and the middle one is for you."
    ],
    es: [
        "Eres tan feo, cuando te miras en el espejo, tu reflejo mira hacia otro lado",
        "Estoy celoso de la gente que no te conoce.",
        "Tu cara hace llorar a las cebollas.",
        "Si la risa es la mejor medicina, tu cara debe estar curando el mundo",
        "Te asaría, pero mi mamá dijo que no puedo quemar basura",
        "¿Tu culo está celoso de la cantidad de mierda que sale de tu boca?",
        "Eres tan tonto, intentaste escalar Mountain Dew",
        "No digo que te odie, pero desconectaría tu soporte vital para cargar mi teléfono",
        "Tienes suficiente grasa para hacer otro ser humano.",
        "Si la estupidez fuera una profesión, serías multimillonario",
        "Tú eres la razón por la que Dios creó el dedo medio",
        "Si quisiera suicidarme, subiría a tu ego y saltaría a tu coeficiente intelectual",
        "Tu árbol genealógico debe ser un cactus porque todos en él son unos idiotas",
        "Lo siento, ¿se suponía que debía estar ofendido? Lo único que me ofende es tu cara",
        "Apuesto a que tu cerebro se siente como nuevo, ya que nunca lo usas",
        "Si vas a tener dos caras, al menos haz que una sea bonita",
        "Es una pena que no puedas retocar tu personalidad con Photoshop",
        "No te estoy insultando, te estoy describiendo.",
        "Es mejor dejar que alguien piense que eres un idiota que abrir la boca y demostrarlo",
        "Las rosas son rojas, las violetas son azules, tengo cinco dedos y el del medio es para ti",
    ],
}

module.exports = {
    data: new SlashCommandBuilder()
      .setName('roastme')
      .setDescription('Get roasted!'),
  
    async execute(interaction) {
      const userId = interaction.user.id;
      const db = new sqlite3.Database('language.db');
  
      db.get('SELECT language FROM language_settings WHERE user_id = ?', [userId], (err, row) => {
        if (err) {
          console.error('Error retrieving language setting:', err);
          return interaction.reply('An error occurred while retrieving the language setting.');
        }
  
        const language = row ? row.language : 'en';
        const selectedRoasts = roasts[language] || roasts.en;
        const roast = selectedRoasts[Math.floor(Math.random() * selectedRoasts.length)];
  
        const embed = new EmbedBuilder()
          .setColor('#3f48cc')
          .setTitle('Roast Me!')
          .setDescription(roast);
  
        interaction.reply({ embeds: [embed] });
        });
    },
  };
