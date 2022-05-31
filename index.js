const discord = require('discord.js')
const { Collection, Intents } = require('discord.js');
const fs = require('fs');

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
}

//handle commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction, variables);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//Login to discord
client.login("ODgxMDg5OTI2NzY5MjgzMDky.G7ydqA._dsrf_KqFqhi-DPBh-NQfajdLw0YShRlQkHeJw");