const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('This command will display the help menu!'),
	async execute(interaction) {
		const exampleEmbed = new MessageEmbed()
			.setColor('#8DB600')
			.setTitle('Help')
			.setTitle('**Help**')
			.setDescription('These are all the commands you can use:')
			.addFields(
				{ name: 'Information', value: '/help \n/info \n/clear `amount`' },
				{ name: 'Music', value: '/play `song or URL`\n/queue \n' },
				{ name: 'Invite', value: 'Danzr can be added to as many servers as you want! [Click here to add it to yours.](https://discord.com/api/oauth2/authorize?client_id=881089926769283092&permissions=139623607872&scope=bot%20applications.commands)' },
			)

			.setTimestamp()
			.setFooter('Danzr', 'https://i.imgur.com/AfFp7pu.png');

		await interaction.reply({ embeds: [exampleEmbed] });
	},
};