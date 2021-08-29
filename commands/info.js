const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Sends info about the bot'),
	async execute(interaction) {
		await interaction.reply('Loading Data');
		const msg = await interaction.fetchReply();
		await interaction.editReply(`**API Ping:**\n${Math.round(interaction.client.ws.ping)} ms\n**Message Ping:**\n${msg.createdTimestamp - interaction.createdTimestamp} ms\n**Current Memory:**\n${Math.round(process.memoryUsage().heapUsed / 1024 / 102)} Bytes`);

	},
};