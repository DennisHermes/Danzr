const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
<<<<<<< Updated upstream
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for(const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.info.name, command);
    console.log(`The command ${command.info.name} has been loaded`)
};

client.once("ready", () => {
    console.log(`${client.user.username} is online!`)
    client.user.setActivity("Music", {type: "PLAYING"});
});

client.on("messageCreate", async message => {
    if (message.author.bot) return;
    var prefix = botConfig.prefix;
    var messageArray = message.content.split(" ");
    var command = messageArray[0];

    if(!message.content.startsWith(prefix)) return;
    const commandData = client.commands.get(command.slice(prefix.length));
    if (!commandData) return
    var arguments = messageArray.slice(1);
    try{
        await commandData.run(client, message, arguments);
    }catch(error){
        console.log(error);
        await message.reply(`There was a error wile running ${command.info.name}`);
    }
=======
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
>>>>>>> Stashed changes
});

client.login(token);