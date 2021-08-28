const {client,MessageEmbed} = require('discord.js');
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    const exampleEmbed = new MessageEmbed()
	.setColor('#8DB600')
	.setTitle('Help')
    .setDescription('These are all the commands you can use:')
	.addFields(
        { name: 'Commands', value: '/help \n/ping \n' },
        { name: 'Invite', value: 'Danzr can be added to as many servers as you want! [Click here to add it to yours.](https://discord.com/oauth2/authorize?client_id=881089926769283092&scope=bot)' }
	)
    
	.setTimestamp()
	.setFooter('Danzr', 'https://i.imgur.com/AfFp7pu.png');

message.channel.send({ embeds: [exampleEmbed] });
}

module.exports.info = {
    name: "help",
    description: "A basic help command"
}