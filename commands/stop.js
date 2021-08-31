const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music.'),
    async execute(interaction, variables) {
        const StoppedEmbed = new MessageEmbed()
            .setColor('#8DB600')
            .setDescription(`Music stopped by ${interaction.member}`);
        await interaction.reply({ embeds: [StoppedEmbed] });
        variables.queue = [];
        variables.connection.destroy();
        variables.connection = null;
        variables.current = null;
    },
};