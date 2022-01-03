const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'snipe', //name of the command
    description: 'Snipe the latest deleted message.',
    run: async(client, message, args) => {
        const msg = client.snipes.get(message.channel.id) //find the deleted message in message channel
        if(!msg) return message.channel.send("Didn't find any deleted messages.") //if there is no deleted message, return this msg

        const embed = new MessageEmbed()
        .setDescription(`**Snipe in <#${message.channel.id}>**\n\n` + 'Message: by: ' + `<@${msg.author}>` + '\nContent: \n' + msg.content)
        .setTimestamp()

        if(msg.image) embed.setImage(msg.image) //if the deleted message has image, then set the image in the embed to it
        message.channel.send({ embeds: [embed] })
    }
}