const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, joinVoiceChannel, } = require('@discordjs/voice');
const { MessageEmbed } = require('discord.js');
const playDl = require('play-dl')
const ytfps = require('ytfps');

var radio = false;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('radio')
		.setDescription('Turn on the music'),
	async execute(interaction, variables) {
		if (radio) {
			interaction = await interaction;

			//Turn radio off
			variables.queue = [];
			variables.connection.destroy();
			variables.connection = null;
			variables.current = null;
			radio = false;
			
			//Sending response
			const Embed = new MessageEmbed()
            	.setColor('#8DB600')
            	.setDescription(`📻 Radio turned off! 📻`);
        	await interaction.reply({ embeds: [Embed] })
			
		} else {

			//Checking for user
			var channel = interaction.member.voice.channel;
			if (!channel) {
				const Embed = new MessageEmbed()
            		.setColor('#8DB600')
            		.setDescription(`You need to be in a voice channel!`);
        		await interaction.reply({ embeds: [Embed] })
				return;
			}

			//Sending response
			const Embed = new MessageEmbed()
            	.setColor('#8DB600')
            	.setDescription(`📻 Radio turned on! 📻`);
        	await interaction.reply({ embeds: [Embed] })

			//Registering radio player
			radio = true;
			if (!variables.connection) {
				variables.connection = joinVoiceChannel({
					channelId: interaction.member.voice.channelId,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				});
			}

			//Importing playlist
			const playlist = await ytfps(variables.URL);
			playlist.videos.forEach(async video => {
				variables.queue.push(video.url);
			});

			//Shuffle playlist
			var shuffledArray = variables.queue;
			var currentIndex = shuffledArray.length, randomIndex;
			while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[shuffledArray[currentIndex], shuffledArray[randomIndex]] = [shuffledArray[randomIndex], shuffledArray[currentIndex]];
			}
			variables.queue = shuffledArray;

			//Starting playlist
			play(variables.queue[0], variables);
		}
	},
};

async function play(songURL, variables) {
	
	try {
		const stream = await playDl.stream(songURL);
		const resource = createAudioResource(stream.stream, {inputType: stream.type});
		if (!variables.player) variables.player = createAudioPlayer();
		variables.player.play(resource, { seek: 0, volume: 1 });
		variables.connection.subscribe(variables.player);

		variables.queue.splice(0, 1);
    	if (!variables.listener) {
			await variables.player.on(AudioPlayerStatus.Idle, () => {
				variables.listener = true;
				if (variables.queue.length != 0) {
					play(variables.queue[0], variables);
				} else {
					variables.connection.destroy();
					variables.connection = null;
					variables.current = null;
					variables.listener = false;
				}
			});
    	}
	} catch (err) {
		console.log(err);
		play(variables.queue[0], variables);
	}
};