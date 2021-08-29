const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Clears the amount of chat messages you enterd!'),
	async execute(interaction) {
		await interaction.reply(`Your tag: **${interaction.user.tag}**\nYour id: **${interaction.user.id}**`);
	},
};