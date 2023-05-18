const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: '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'
});

const openai = new OpenAIApi(configuration);

const questionLimits = {
    '1234567890': 10,
    '0987654321': 5,
};

const questionCount = {};

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatgpt')
        .setDescription('Ask ChatGPT a question!')
        .addStringOption(option => option.setName('question').setDescription('This is going to be the question for ChatGPT').setRequired(true))
        .setDMPermission(false),
    async execute(interaction) {
        const userId = interaction.user.id;

        const userLimit = questionLimits[userId];
        if (userLimit && (questionCount[userId] || 0) >= userLimit) {
            return await interaction.reply('Sorry, you have reached the maximum limit of questions for today.');
        }

        await interaction.deferReply();

        const question = interaction.options.getString('question');

        try {
            const res = await openai.createCompletion({
                model: 'text-davinci-003',
                max_tokens: 2048,
                temperature: 0.5,
                prompt: question
            });

            const embed = new EmbedBuilder()
                .setColor('#3f48cc')
                .addFields(
                    { name: 'Question', value: question },
                    { name: 'Response', value: `\`\`\`${res.data.choices[0].text}\`\`\`` }
                );
        
            await interaction.editReply({ embeds: [embed] });

            if (userLimit) {
                questionCount[userId] = (questionCount[userId] || 0) + 1;
            }
        } catch (e) {
            console.error(e);
            return await interaction.editReply({ content: `Request failed with status code **${e.response.status}**`, ephemeral: true });
        }
    }
};
