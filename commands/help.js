const {MessageEmbed} = require('discord.js');
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    // var commandList = [];
    // bot.commands.array.forEach(command => {
    //     var constructor = {
    //         name: command.info.name,
    //         description: command.info.description,
    //         category : command.info.category
    //     }
    //     commandList.push(constructor);
    // });

    // var response = "**Bot commands**\n\n";
    // var information = "**__Information__**\n";
    // var music = "**__Music__**\n";

    // for (let i = 0; i < commandList.length; i++) {
    //     const command = commandList[i];
    //     if(command["catagory"] == "information") {
    //         general += `/${command["name"]} - ${command["description"]}\n`;
    //     } else if(command["catagory"] == "music") {
    //         general += `/${command["name"]} - ${command["description"]}\n`;
    //     }
    // }

    // response += information;
    // response += music;

    // message.author.send(response).then

    const exampleEmbed = new MessageEmbed()
	.setColor('#8DB600')
	.setTitle('**Help**')
    .setDescription('These are all the commands you can use:')
	.addFields(
        { name: 'Commands', value: '/help \n/play \n' },
        { name: 'Invite', value: 'Danzr can be added to as many servers as you want! [Click here to add it to yours.](https://discord.com/oauth2/authorize?client_id=881089926769283092&scope=bot)' }
	)
    
	.setTimestamp()
	.setFooter('Danzr', 'https://i.imgur.com/AfFp7pu.png');

message.channel.send({ embeds: [exampleEmbed] });
}

module.exports.info = {
    name: "help",
    description: "A basic help command",
    category: "information"
}