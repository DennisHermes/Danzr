const { AudioPlayerStatus, demuxProbe, createAudioPlayer, createAudioResource, joinVoiceChannel, } = require('@discordjs/voice');
const { SlashCommandBuilder } = require('@discordjs/builders');
var fs = require('fs');

const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('FUUUUUUUUUUUUUUUUUUUCCCCCCCCCCCCCCCCCCCKKKKKKKKKKKKKKKK'),
    async execute(interaction) {
        const { stream, type } = await demuxProbe(fs.createReadStream("test.mp3"));
        const resource = createAudioResource(stream, { inputType: type });
        const player = createAudioPlayer();

        voiceChannel = interaction.member.voice.channel;
        guild = interaction.member.guild;
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        
        player.play(resource);
        connection.subscribe(player);

        player.once(AudioPlayerStatus.Idle, () => connection.destroy());

        await interaction.reply(`Danzr is in the house!`);
    },
};