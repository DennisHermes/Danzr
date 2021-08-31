const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const youtube = require('play-dl');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See what is in the queue!'),
	async execute(interaction, variables) {
        const AnalysingEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`Calculating...`);
        await interaction.reply({ embeds: [AnalysingEmbed] });

        const QueueEmbed = new MessageEmbed()
        .setColor('#8DB600');
        
        if (variables.queue.length != 0) {
            QueueEmbed.addFields( {name: `Currently playing:`, value: `[${variables.currect.title}](${variables.currect.url})`} );

            var queueString = " ";
            var i = 0;
            var secondDuration = variables.currect.length;
            variables.queue.forEach(async element => {
                let songInfo = await youtube.video_info(element);
                song = {
                    title: songInfo.video_details.title,
                    length: songInfo.video_details.durationInSec
                };
                i++;
                queueString = queueString + `**${i}.** ` + `[${song.title}](${element})` + `\n`;
                secondDuration = (+secondDuration + +song.length);

                if (i === variables.queue.length || i === 10) {
                    var minutes = Math.floor(secondDuration / 60);
                    var hours = Math.floor(minutes / 60);
                    var seconds = secondDuration - minutes * 60;
                    minutes = minutes - hours * 60;

                    QueueEmbed.addFields( {name: `Queue:`, value: `${queueString}`} )
                    .setFooter(`Total duration: ${hours}:${minutes}:${seconds}`);
                    await interaction.editReply({ embeds: [QueueEmbed] });
                }
            });
        } else {
            QueueEmbed.setDescription(`The queue is empty`);
            await interaction.editReply({ embeds: [QueueEmbed] });
        }
	},
};