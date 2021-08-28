const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('This is a test command to see if i know how it works'),
	async execute(interaction) {
		await interaction.reply('i know!!');
	},
};