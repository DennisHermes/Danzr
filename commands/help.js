const { MessageEmbed } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    const exampleEmbed = new MessageEmbed()
	.setColor('#8DB600')
	.setTitle('Help')
	.setAuthor('Danzr', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

message.channel.send({ embeds: [exampleEmbed] });
}

module.exports.info = {
    name: "help"
}