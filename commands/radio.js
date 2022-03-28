const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const youtube = require('play-dl');
const { MessageEmbed } = require('discord.js');

const Youtube = require('simple-youtube-api');
const { youtubeAPI } = require('../config.json');
const yt = new Youtube(youtubeAPI);

var radio = false;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('radio')
		.setDescription('Turn on the music'),
	async execute(interaction, variables) {
		if (radio) {
			variables.queue = [];
			variables.connection.destroy();
			variables.connection = null;
			variables.current = null;
			
			const Embed = new MessageEmbed()
            	.setColor('#8DB600')
            	.setDescription(`📻 Radio turned off! 📻`);
        	await interaction.reply({ embeds: [Embed] })

			radio = false;
		} else {
			var channel = interaction.member.voice.channel;

			if (!channel) {
				const Embed = new MessageEmbed()
            		.setColor('#8DB600')
            		.setDescription(`You need to be in a voice channel!`);
        		await interaction.reply({ embeds: [Embed] })
				return;
			}

			const Embed = new MessageEmbed()
            	.setColor('#8DB600')
            	.setDescription(`📻 Radio turned on! 📻`);
        	await interaction.reply({ embeds: [Embed] })

			radio = true;

			const URL = "https://www.youtube.com/playlist?list=PLqiOqorfWp7hScCAl0l9YcT1c23ZNsRAf";

			const playlist = await yt.getPlaylist(URL);
			let videosArray = await playlist.getVideos();
			videosArray.forEach(async element => {
				variables.queue.push(element.url);
			});
			
			if (!variables.connection) {
				variables.connection = joinVoiceChannel({
					channelId: interaction.member.voice.channelId,
					guildId: channel.guild.id,
					adapterCreator: channel.guild.voiceAdapterCreator,
				});
			}

			var array = variables.queue;

			var currentIndex = array.length, randomIndex;
	
			while (currentIndex != 0) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex], array[currentIndex]];
			}

			variables.queue = array;

			play(variables.queue[0], variables)
		}
	},
};

async function play(songURL, variables) {
    let songInfo = await youtube.video_info(songURL);
    song = {
        title: songInfo.video_details.title,
        url: songInfo.video_details.url,
        length: songInfo.video_details.durationRaw,
        tumbnail: songInfo.video_details.thumbnail.url
    };

	console.log(song.title);

    variables.currect = song;

	try {
		let stream = await youtube.stream(songURL);
		let resource = createAudioResource(stream.stream, {inputType : stream.type});
		if (!variables.player) variables.player = createAudioPlayer();
		variables.player.play(resource);
		variables.connection.subscribe(variables.player);
	} catch {
		play(variables.queue[0], variables);
	}

    variables.queue.splice(0, 1);
    if (!variables.listener) {
        variables.player.on(AudioPlayerStatus.Idle, () => {
            variables.listener = true;
            if (variables.queue.length != 0) {
                play(variables.queue[0], variables);
            } else {
                loop(variables);
            }
        });
    }
};

async function loop(variables) {
	const playlist = await yt.getPlaylist(URL);
	let videosArray = await playlist.getVideos();
	videosArray.forEach(async element => {
		variables.queue.push(element.url);
	});
	var array = variables.queue;

	var currentIndex = array.length, randomIndex;

	while (currentIndex != 0) {
	randomIndex = Math.floor(Math.random() * currentIndex);
	currentIndex--;
	[array[currentIndex], array[randomIndex]] = [
		array[randomIndex], array[currentIndex]];
	}

	variables.queue = array;

	play(variables.queue[0], variables);
}