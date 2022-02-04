const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder() //create a new slash command
        .setName('daily') //name of the command
        .setDescription('Get daily coins'), //description of the cmd
    async execute(client, interaction) {
        let user = interaction.user; //interaction user (the one who use the slash command)
        let amount = 300; // the amount of money for daily reward

        let time = 86400000; // 1 day --> ms
        let daily = await db.get(`daily_${user.id}`) // get the db of the Date of getting daily reward

        let duration = ms(time - (Date.now() - daily), { long: true }); // the time (1 day) minus (the date of using the cmd minus the daily db). Then convert the ms to hours/minutes/s, simply make the time writing long.

        if(daily !== null && time - (Date.now() - daily) > 0) { // if the daily db is not null and the time (1 day) minus (the date of using the cmd minus the daily db) is bigger than 0
            interaction.reply({ content: `**You will be able to get daily reward after \`${duration}\`** `, ephemeral: true });
        } else { // if it is 24hrs later since last time using this command (successfully) then it will return an embed
            let embed = new MessageEmbed()
            .setTitle(`Here are your daily coins, ${user.username}`)
            .setDescription(`Congratulation! You received ${amount} coins!`)
            interaction.reply({ embeds: [embed] }); //send a embed that u received coins successfully

            db.add(`wallet_${user.id}`, amount) //add the amount of money to wallet db
            db.set(`daily_${user.id}`, Date.now()) // set the Date this command is used, so next time for using this command is 24 hours later.
        }
    }

}