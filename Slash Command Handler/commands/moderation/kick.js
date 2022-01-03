const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'kick',
    description: 'Kick a user from the server. ',
    run: async(client, message, args) => {
        const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0]) //find the member with id or with mention
        const reason = args.slice(1).join(' ') //join the arguments you write as reason of kicking the member

        if(!mentionedMember) return message.reply('**Please specify a member!**') //if you didn't mention the user you wanna kick, return this msg

        if(!message.member.permissions.has('KICK_MEMBERS')) { //if you (user) don't have kick member permission then
            const kickError = new MessageEmbed()
            .setDescription('**You don\'t have permissions to kick members!**')
            return message.channel.send({ embeds: [kickError] }) //return this embed

        } else if(!message.guild.me.permissions.has('KICK_MEMBER')) { //if bot don't have kick member permission then
            const kickError1 = new MessageEmbed()
            .setDescription('**I don\'t have permissions to kick members!**')
            return message.channel.send({ embeds: [kickError1] }) //return this embed
        }

        const mentionedPosition = mentionedMember.roles.highest.position //the highest role of the mentioned member
        const memberPosition = message.member.roles.highest.position //highest role of you
        const botPosition = message.guild.me.roles.highest.position //highest role of the bot

        if(memberPosition <= mentionedPosition) { //if your role is lower or equals to the mentioned member u wanna kick
            const kickErr = new MessageEmbed()
            .setDescription('**You cannot kick this member because their role is higher/equal to yours!**')
            return message.channel.send({ embeds: [kickErr] }) //return this embed
        } else if (botPosition <= mentionedPosition) { //if bot role is lower or equals to the mentioned member u wanna kick
            const kickErr1 = new MessageEmbed()
            .setDescription('**I cannot kick this member because their role is higher/equal to mine!**')
            message.channel.send({ embeds: [kickErr1] }) //return this embed
        }

        try{
            const reasonDm = new MessageEmbed() //DM the kicked user, tell him/her the reason of being kicked
            .setTitle(`You were kicked by ${message.author.tag}!`)
            .setDescription(`Reason: ${reason}`)
            await mentionedMember.send({ embeds: [reasonDm] }) //send the embed to DM
            await mentionedMember.kick().then(() => { //then kick the user
                
                const kickSuccess = new MessageEmbed()
                .setTitle(`${mentionedMember.user.tag} was kicked\nby ${message.author.tag}`)
                .setDescription(`Reason: ${reason}`)
                message.channel.send({ embeds: [kickSuccess] }) //send a message in channel that you kicked that user
            })


        } catch (error) {
            const errorEmbed = new MessageEmbed()
            .setDescription(':x: **There was an error while kicking this user!**')
            return message.channel.send({ embeds: [errorEmbed] }) //send an embed when it caught error
        }
    }
}