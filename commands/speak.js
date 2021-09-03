const { SlashCommandBuilder } = require('@discordjs/builders');
const { createAudioResource, createAudioPlayer, joinVoiceChannel } = require('@discordjs/voice');
const say = require('say');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speak')
		.setDescription('Text to speech.')
        .addStringOption(option =>
            option.setName('text')
            .setDescription('text that need to be spoken.')
            .setRequired(true)
        ),
	async execute(interaction) {
        const arg = interaction.options.getString('text');

        await interaction.reply(`Saying **${arg}**...`);

        say.export(`${arg}`, 'Microsoft David Desktop', 0.8, './speach.mp3', (err) => {
            if (err) {
              return console.error(err)
            } else {
                channel = interaction.member.voice.channel;
                const connection = joinVoiceChannel({
                    channelId: interaction.member.voice.channelId,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                });

                let resource = createAudioResource('./speach.mp3');
                const player = createAudioPlayer();

                player.play(resource);
                connection.subscribe(player);
            }
        });
	},
};