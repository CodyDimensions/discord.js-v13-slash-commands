const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'membercount', //name of your command
    description: 'Count the number of members & bot in this server.', //description of your command
    run: async(client, message, args) => {
        let embed = new MessageEmbed()
        .setTitle(`Total Members`)
        .setDescription(`👥 ${message.guild.memberCount}\n\n**Human**\n👤 ${message.guild.members.cache.filter(member => !member.user.bot).size}\n\n**Bot**\n🤖 ${message.guild.members.cache.filter(member => member.user.bot).size}`)
        .setThumbnail(message.guild.iconURL({ size: 4096, dynamic: true }))
        .setTimestamp()
        message.channel.send({ embeds: [embed] })
    }
}