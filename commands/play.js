const { SlashCommandBuilder } = require('@discordjs/builders');
const { AudioPlayerStatus, createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const yts = require("yt-search");
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

        if (validedURL(arg)) {
            const SearchingEmbed = new MessageEmbed()
                .setColor('#8DB600')
                .setDescription(`Searching for **${arg}**`);
            interaction.editReply({ embeds: [SearchingEmbed] });

            //create link from search
            const {videos} = await yts(arg);
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
        song = {
            title: songInfo.video_details.title,
            url: songInfo.video_details.url,
            length: songInfo.video_details.durationRaw,
            tumbnail: songInfo.video_details.thumbnail.url
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
        tumbnail: songInfo.video_details.thumbnail.url
    };

    variables.currect = song;

    let stream = await youtube.stream(songURL);
    let resource = createAudioResource(stream.stream, {inputType : stream.type});

    if (!variables.player) variables.player = createAudioPlayer();
    variables.player.play(resource);
    variables.connection.subscribe(variables.player);

    variables.queue.splice(0, 1);
    variables.player.on(AudioPlayerStatus.Idle, () => {
        if (variables.queue.length != 0) {
            play(variables.queue[0], variables)
        } else {
            variables.connection.destroy();
            variables.connection = null;
        }
    });
};

async function validedURL(url) {
    try {
      new URL(url);
    } catch (e) {
      return false;
    }
    return true;
  };