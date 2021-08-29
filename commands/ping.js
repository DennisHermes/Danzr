const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with API latency!'),
	async execute(interaction) {
		await interaction.reply(`API Latency is:** ${Math.round(interaction.client.ws.ping)}ms**`);
	},
};