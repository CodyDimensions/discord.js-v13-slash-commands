const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { parse } = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder() //create a new slash cmd
    .setName('purge') // name of ur slash cmd
    .setDescription('Purge an amount of message') // description of ur slash cmd
    .addIntegerOption((option) => { // add a Integer option which only allow user to type an Integer (number not string or double)
        return option
        .setName('amount') // name of the option
        .setDescription('Amount of message to delete') // description of the slash cmd
        .setRequired(true) // required option, must input amount
    }),
    async execute(client, interaction) {
        if(!interaction.member.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: "You don't have `MANAGE_MESSAGES` permission to use this command!"}) // return if user don't have manage messages permission
        if(!interaction.guild.me.permissions.has('MANAGE_MESSAGES')) return interaction.reply({ content: "I don't have `MANAGE_MESSAGES` permission to execute this command!"}) // return if bot don't have manage messages permission

        let amount = interaction.options.getInteger('amount') // get the integer that user inputted in option

        if(isNaN(amount) || amount < 1) { // if the amount is not valid then return msg
            return interaction.reply({ content: '**Please specify a valid amount between 1 - 100!**', ephemeral: true })
        }

        if(parseInt(amount) > 99) { // if the amount is bigger then 99 then return msg
            return interaction.reply({ content: '**I can only delete 99 messages once!', ephemeral: true })
        } else {
            try{
            let { size } = await interaction.channel.bulkDelete(amount) // get the size of deleted messages from the bulkDelete()
            await interaction.reply({ content: `Deleted ${size} messages.`, ephemeral: true })
            } catch(e) { // if there is error (mostly because of messages are older then 14 days) cannot delete and return a msg
                console.log(e)
                interaction.reply({ content: `I cannot delete messages that is older than 14 days.`, ephemeral: true })
            }
        }
    }
}