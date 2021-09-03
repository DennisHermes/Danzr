const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('Shuffle the queue.'),
	async execute(interaction, variables) {
        var array = variables.queue;

		var currentIndex = array.length, randomIndex;
  
        while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        variables.queue = array;

        const AnalysingEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`The queue is now shuffled.`);
        await interaction.reply({ embeds: [AnalysingEmbed] });
	},
};