const discord = require('discord.js')
const { Collection, Intents } = require('discord.js');
const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const radio = require('./commands/radio');

const client = new discord.Client({ intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES] , partials : ['CHANNEL', 'MESSAGE']})

//register commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

//on ready
client.once('ready', () => {
	console.log('[Danzr] Done loading!');
});

//public variables
var connection;
var player;
var currect;
var queue = [];

var variables = {
	connection: connection,
	queue: queue,
	player: player,
	currect: currect,
	listener: false,
	URL: "https://www.youtube.com/playlist?list=PLqiOqorfWp7hScCAl0l9YcT1c23ZNsRAf",
}

//handle commands
client.on('interactionCreate', async interaction => {
	if (interaction.isButton()) {
		if (interaction.customId == "Hardstyle") {
			variables.URL = "https://www.youtube.com/playlist?list=PLqiOqorfWp7gb9qecNVfMW52kO9oFK0bt";
			radio.execute(interaction, variables);
		} else if (interaction.customId == "NCS") {
			variables.URL = "https://www.youtube.com/playlist?list=PLRBp0Fe2GpgmsW46rJyudVFlY6IYjFBIK";
			radio.execute(interaction, variables);
		} else {
			variables.URL = "https://www.youtube.com/playlist?list=PLqiOqorfWp7hScCAl0l9YcT1c23ZNsRAf";
			radio.execute(interaction, variables);
		}
	} else if (interaction.isCommand()) {
		const command = client.commands.get(interaction.commandName);
		try {
			await command.execute(interaction, variables);
		} catch (error) {
			console.error(error);
			return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

//voice channel join
client.on('voiceStateUpdate', (newMember) => {
	if (!newMember.channel) {
		let newUserChannel = newMember;
		let greeting = "Goedeavond ";

		var today = new Date();
		var curHr = today.getHours();
		if (curHr < 12) {
			greeting = "Goedemorgen ";
		} else if (curHr < 18) {
			greeting = "Goedemiddag ";
		}

		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('Normaal')
					.setLabel('Normale radio')
					.setStyle('SECONDARY')
					.setEmoji('📻'),
				new MessageButton()
					.setCustomId('Hardstyle')
					.setLabel('Hardstyle radio')
					.setStyle('SECONDARY')
					.setEmoji('🎧'),
				new MessageButton()
					.setCustomId('NCS')
					.setLabel('NCS')
					.setStyle('SECONDARY')
					.setEmoji('⛔')
		);
		const Embed = new MessageEmbed()
			.setColor('#8DB600')
			.setDescription(greeting + newUserChannel.member.user.username + "!");
		client.channels.cache.get("767435347050758169").send({ embeds: [Embed], components: [row] });
	}
});

//Login to discord
client.login(process.env.token);
