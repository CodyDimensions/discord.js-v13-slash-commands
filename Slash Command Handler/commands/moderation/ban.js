const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ban',
    description: 'Ban a user from the server. ',
    run: async(client, message, args) => {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) //find the member with id or with mention
        const reason = args.slice(1).join(' ') //join the arguments you write as reason of banning the member

        if(!mentionedMember) return message.reply('**Please specify a member!**') //if you didn't mention the user you wanna ban, return this msg

        if(!message.member.permissions.has('BAN_MEMBERS')) { //if you (user) don't have ban member permission then
            const banError = new MessageEmbed()
            .setDescription('**You don\'t have permissions to ban members!**')
            return message.channel.send({ embeds: [banError] }) //return this embed

        } else if(!message.guild.me.permissions.has('BAN_MEMBERS')) { //if bot don't have ban member permission then
            const banError1 = new MessageEmbed()
            .setDescription('**I don\'t have permissions to ban members!**')
            return message.channel.send({ embeds: [banError1] }) //return this embed
        }

        const mentionedPosition = mentionedMember.roles.highest.position //the highest role of the mentioned member
        const memberPosition = message.member.roles.highest.position //highest role of you
        const botPosition = message.guild.me.roles.highest.position //highest role of the bot

        if(memberPosition <= mentionedPosition) { //if your role is lower or equals to the mentioned member u wanna ban
            const banErr = new MessageEmbed()
            .setDescription('**You cannot ban this member because their role is higher/equal to yours!**')
            return message.channel.send({ embeds: [banErr] }) //return this embed
        } else if (botPosition <= mentionedPosition) { //if bot role is lower or equals to the mentioned member u wanna ban
            const banErr1 = new MessageEmbed()
            .setDescription('**I cannot ban this member because their role is higher/equal to mine!**')
            message.channel.send({ embeds: [banErr1] }) //return this embed
        }

        try{
            const reasonDm = new MessageEmbed() //DM the banned user, tell him/her the reason of being banned
            .setTitle(`You were banned by ${message.author.tag}!`)
            .setDescription(`Reason: ${reason}`)
            await mentionedMember.send({ embeds: [reasonDm] }) //send the embed to DM
            await mentionedMember.ban({ reason: reason }).then(() => { //then ban the user
                
                const banSuccess = new MessageEmbed()
                .setTitle(`${mentionedMember.user.tag} was banned\nby ${message.author.tag}`)
                .setDescription(`Reason: ${reason}`)
                message.channel.send({ embeds: [banSuccess] }) //send a message in channel that you banned that user
            })


        } catch (error) {
            const errorEmbed = new MessageEmbed()
            .setDescription(':x: **There was an error while banning this user!**')
            return message.channel.send({ embeds: [errorEmbed] }) //send an embed when it caught error
        }
    }
}