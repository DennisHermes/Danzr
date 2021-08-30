const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const youtube = require('play-dl');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play music')
        .addStringOption(option =>
            option.setName('title')
            .setDescription('song title or url')
            .setRequired(true)
        ),
    async execute(interaction) {
        const arg = interaction.options.getString('title');

        channel = interaction.member.voice.channel;
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channelId,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });

        var pattern = new RegExp('^(https?:\\/\\/)?'+
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
        '((\\d{1,3}\\.){3}\\d{1,3}))'+
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
        '(\\?[;&a-z\\d%_.~+=-]*)?'+
        '(\\#[-a-z\\d_]*)?$','i');

        if (!!pattern.test(arg)) {
            let songInfo = await youtube.video_info(arg);
            song = {
                title: songInfo.video_details.title,
                url: songInfo.video_details.video_url
            };

            const stream = ytdl(arg, { filter: 'audioonly', quality: 'highestaudio' });
            var resource = createAudioResource(stream);

            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);

            await interaction.reply(`Now playing: **${song.title}**`);
        } else {
            const {videos} = await yts(arg);
            if (!videos.length) return message.channel.send("No songs were found!");
            song = {
                title: videos[0].title,
                url: videos[0].url
            };

            const stream = ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio' })
            var resource = createAudioResource(stream);

            const player = createAudioPlayer();
            player.play(resource);
            connection.subscribe(player);

            await interaction.reply(`Now playing: **${song.title}**`);
        }
    },
};