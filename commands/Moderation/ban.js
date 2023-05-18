const { SlashCommandBuilder } = require('discord.js');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('ban.db');

// Create the banned_users table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS banned_users (
    userId TEXT PRIMARY KEY,
    reason TEXT
  )
`, (error) => {
  if (error) {
    console.error('Error creating banned_users table:', error);
  } else {
    console.log('banned_users table created successfully!');
  }
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Enter the reason for banning')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });
    }

    db.run('INSERT INTO banned_users (userId, reason) VALUES (?, ?)', [user.id, reason], (error) => {
      if (error) {
        console.error('Error inserting banned user:', error);
        return interaction.reply({
          content: 'Failed to ban the user. Please try again later.',
          ephemeral: true,
        });
      }

      interaction.guild.members.ban(user, { reason: reason });

      interaction.reply({
        content: `User ${user} has been banned. Reason: ${reason}`,
        ephemeral: true,
      });
    });
  },
};
