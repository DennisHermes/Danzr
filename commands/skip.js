const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { AudioPlayerStatus, createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const youtube = require('play-dl');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip the current song.'),
	async execute(interaction, variables) {
        const AnalysingEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`Skipping the current song...`);
        await interaction.reply({ embeds: [AnalysingEmbed] });

		let songInfo = await youtube.video_info(variables.queue[0]);
        song = {
            title: songInfo.video_details.title,
            url: songInfo.video_details.url,
            length: songInfo.video_details.durationRaw,
            tumbnail: songInfo.video_details.thumbnail.url
        };

        variables.currect = song;

        let stream = await youtube.stream(variables.queue[0]);
        let resource = createAudioResource(stream.stream, {inputType : stream.type});

        if (!variables.player) variables.player = createAudioPlayer();
        variables.player.play(resource);
        variables.connection.subscribe(variables.player);


        variables.queue.splice(0, 1);
        if (!variables.listener) {
            variables.player.on(AudioPlayerStatus.Idle, () => {
                variables.listener = true;
                if (variables.queue.length != 0) {
                    play(variables.queue[0], variables)
                } else {
                    variables.connection.destroy();
                    variables.connection = null;
                    variables.current = null;
                    variables.listener = false;
                }
            });
        }
	},
};