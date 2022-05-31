const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const youtube = require('play-dl');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play some music.')
        .addStringOption(option =>
            option.setName('title')
            .setDescription('song title or url')
            .setRequired(true)
        ),
    async execute(interaction, variables) {

        //get arguments
        const arg = interaction.options.getString('title');
        var songURL = arg;

        //get current channel
        channel = interaction.member.voice.channel;

        //check if user inst connected to channel
        if (!channel) {
            await interaction.reply(`You need to join a voice channel first!`);
            return;
        }

        const AnalysingEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`Analysing request...`);
        await interaction.reply({ embeds: [AnalysingEmbed] });

        if (isURL(arg)) {
            var queuePosition = "**Currectly playing**";
            if (variables.player) {
                queuePosition = `**#${(variables.queue.indexOf(arg) + 1)}** in the queue`;
            }

            let songInfo = await youtube.video_info(arg);
            song = {
                title: songInfo.video_details.title,
                url: songInfo.video_details.url,
                length: songInfo.video_details.durationRaw,
                tumbnail: songInfo.video_details.thumbnail.url
            };

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('Remove')
                    .setLabel('Remove Song')
                    .setStyle('SECONDARY')
                    .setEmoji('❌'),
                new MessageButton()
                    .setCustomId('Jump')
                    .setLabel('Jump to song')
                    .setStyle('SECONDARY')
                    .setEmoji('💨'),
            );
            const SongEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`**[${song.title}](${song.url})**`)
            .setThumbnail(`${song.tumbnail}`)
            .addFields(
                { name: `:clock1: Duration`, value: `**${song.length}**` },
                { name: `:placard:  Queue position`, value: `${queuePosition}` },
            );
            interaction.editReply({ embeds: [SongEmbed], components: [row] });

            //create a connection
            if (!variables.connection) {
                variables.connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });
                play(song.url, variables);
            }
        } else {
            const SearchingEmbed = new MessageEmbed()
                .setColor('#8DB600')
                .setDescription(`Searching for **${arg}**`);
            interaction.editReply({ embeds: [SearchingEmbed] });

            //create link from search
            const {videos} = await ytSearch(arg);
            if (!videos.length) {
                const NoSongEmbed = new MessageEmbed()
                    .setColor('#8DB600')
                    .setDescription(`Could not find any songs for **${arg}**...`);
                interaction.editReply({ embeds: [NoSongEmbed] });
                return;
            }
            songURL = videos[0].url;
        }
        variables.queue.push(songURL);

        let songInfo = await youtube.video_info(songURL);
        console.log(songInfo.video_details.thumbnail);
        song = {
            title: songInfo.video_details.title,
            url: songInfo.video_details.url,
            length: songInfo.video_details.durationRaw,
            tumbnail: songInfo.video_details.thumbnail
        };

        var queuePosition = "**Currectly playing**";
        if (variables.player) {
            queuePosition = `**#${(variables.queue.indexOf(songURL) + 1)}** in the queue`;
        }

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('Remove')
                .setLabel('Remove Song')
                .setStyle('SECONDARY')
                .setEmoji('❌'),
            new MessageButton()
                .setCustomId('Jump')
                .setLabel('Jump to song')
                .setStyle('SECONDARY')
                .setEmoji('💨'),
        );
        const SongEmbed = new MessageEmbed()
        .setColor('#8DB600')
        .setDescription(`**[${song.title}](${song.url})**`)
        //.setThumbnail(`${song.tumbnail}`)
        .addFields(
            { name: `:clock1: Duration`, value: `**${song.length}**` },
            { name: `:placard:  Queue position`, value: `${queuePosition}` },
        );
        interaction.editReply({ embeds: [SongEmbed], components: [row] });

        //create a connection
        if (!variables.connection) {
            variables.connection = joinVoiceChannel({
                channelId: interaction.member.voice.channelId,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            });
            play(variables.queue[0], variables);
        }
    },
};

async function play(songURL, variables) {
    let songInfo = await youtube.video_info(songURL);
    song = {
        title: songInfo.video_details.title,
        url: songInfo.video_details.url,
        length: songInfo.video_details.durationRaw,
        //tumbnail: songInfo.video_details.thumbnail.url
    };

    variables.currect = song;

    const stream = ytdl(songURL, { filter: 'audioonly' });
    if (!variables.player) variables.player = createAudioPlayer();
    variables.player.play(stream, { seek: 0, volume: 1 });
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
};

function isURL(url) {
    var regExp = /^https?\:\/\/(?:www\.youtube(?:\-nocookie)?\.com\/|m\.youtube\.com\/|youtube\.com\/)?(?:ytscreeningroom\?vi?=|youtu\.be\/|vi?\/|user\/.+\/u\/\w{1,2}\/|embed\/|watch\?(?:.*\&)?vi?=|\&vi?=|\?(?:.*\&)?vi?=)([^#\&\?\n\/<>"']*)/i;
    var match = url.match(regExp);
    return (match && match[1].length==11)? match[1] : false;
}