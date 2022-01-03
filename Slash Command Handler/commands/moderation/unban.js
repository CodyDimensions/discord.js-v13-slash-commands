const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'unban',
    description: 'Unan a user from the server. ',
    run: async(client, message, args) => {
        if(!args[0]) return message.reply('**Please specify a banned user ID!**')

        if(!message.member.permissions.has('BAN_MEMBERS')) { //if you (user) don't have ban member permission then
            const unbanError = new MessageEmbed()
            .setDescription('**You don\'t have permissions to unban members!**')
            return message.channel.send({ embeds: [unbanError] }) //return this embed

        } else if(!message.guild.me.permissions.has('BAN_MEMBERS')) { //if bot don't have ban member permission then
            const unbanError1 = new MessageEmbed()
            .setDescription('**I don\'t have permissions to unban members!**')
            return message.channel.send({ embeds: [unbanError1] }) //return this embed
        }

        try{
            let user = await message.guild.members.unban(args[0]) //unban the user. Finding the user by the User ID you given in argument 0
            let unbanSuccess = new MessageEmbed()
            .setTitle(`${user.tag} was unbanned\nby ${message.author.tag}`)
            return message.channel.send({ embeds: [unbanSuccess] })
        } catch {
            let errorEmbed = new MessageEmbed()
            .setDescription(":x: **I couldn't unban the user or the user is not banned**")
            return message.channel.send({embeds: [errorEmbed]})
        }
    }
};