const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const youtube = require('play-dl');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('See what is in the queue!')
        .addIntegerOption(option =>
            option.setName('page')
            .setDescription('page to show the queue.')
            .setRequired(false)
        ),
	async execute(interaction, variables) {
        //Fist response embed
        const AnalysingEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`Calculating...`);
        await interaction.reply({ embeds: [AnalysingEmbed] });

        //page callculation
        var arg = interaction.options.getString('page');
        if (!arg) {
            arg = 1;
        }
        const queueNumbers = arg * 10;
        if (!variables.queue[+queueNumbers - 10]) {
            const emptyEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`There is nothing on this page`);
            await interaction.reply({ embeds: [emptyEmbed] });
            return;
        }

        //Creating string
        var queueString = "error";
        for (let i = 0; i == (queueNumbers + 1); i++) {
            if (variables.queue[i]) {
                let songInfo = await youtube.video_info(variables.queue[i]);
                song = {
                    title: songInfo.video_details.title,
                    length: songInfo.video_details.durationInSec
                };

                console.log(`${song.title}`);
                queueString = queueString + `**${i}.** ` + `[${song.title}](${variables.queue[i]})` + `\n`;
            }

            if (i == queueNumbers) {
                //Create embed
                const QueueEmbed = new MessageEmbed()
                .setColor('#8DB600')
                .addFields( {name: `Currently playing:`, value: `[${variables.currect.title}](${variables.currect.url})`} )
                .addFields( {name: `Queue:`, value: `${queueString}`} );
                interaction.editReply({ embeds: [QueueEmbed] });
            }
        }

        // if (variables.queue.length != 0) {
        //     QueueEmbed.addFields( {name: `Currently playing:`, value: `[${variables.currect.title}](${variables.currect.url})`} );

        //     var queueString = " ";
        //     var i = 0;
        //     var secondDuration = variables.currect.length;
        //     variables.queue.slice(-3).forEach(async element => {
        //         let songInfo = await youtube.video_info(element);
        //         song = {
        //             title: songInfo.video_details.title,
        //             length: songInfo.video_details.durationInSec
        //         };
        //         i++;
        //         queueString = queueString + `**${i}.** ` + `[${song.title}](${element})` + `\n`;
        //         secondDuration = (+secondDuration + +song.length);

        //         if (i === variables.queue.length) {
        //             var minutes = Math.floor(secondDuration / 60);
        //             var hours = Math.floor(minutes / 60);
        //             var seconds = secondDuration - minutes * 60;
        //             minutes = minutes - hours * 60;

        //             QueueEmbed.addFields( {name: `Queue:`, value: `${queueString}`} )
        //             .setFooter(`Total duration: ${hours}:${minutes}:${seconds}`);
        //             await interaction.editReply({ embeds: [QueueEmbed] });
        //         }
        //     });
        // } else {
        //     QueueEmbed.setDescription(`The queue is empty`);
        //     await interaction.editReply({ embeds: [QueueEmbed] });
        // }
	},
};