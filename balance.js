const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db'); //the npm we use to create/get database

module.exports = {
    data: new SlashCommandBuilder() //create a new slash cmd with slash command builder
        .setName('balance') //set the name of the slash command
        .setDescription('Displays the balance of a user.') //description of the slash cmd
        .addUserOption((option) => { //add a slash cmd options for user to choose which balance of the user he/she wants to display
            option
            .setName('user') //name of the option
            .setDescription('Select a user') //description of the option
            .setRequired(false) //user can choose a user or check the balance of interaction user
        }),
        /* you can use this also if you don't want to use {}
        .addUserOption((option) => //add a slash cmd options for user to choose which balance of the user he/she wants to display
            option
            .setName('user') //name of the option
            .setDescription('Select a user') //description of the option
            .setRequired(false) //user can choose a user or check the balance of interaction user
        ),
        */
        async execute(client, interaction) {
            let user = interaction.options.getUser('user') //get the user from the options of slash cmd
            
            //user getted in options and get the wallet * bank db of them
            let wallet = db.get(`wallet_${user}`) //get the wallet db of a user
            let bank = db.get(`bank_${user}`) //get the bank db of a user

            //user did not select any user, so they get the interaction user's wallet/bank db
            let authorWallet = db.get(`wallet_${interaction.user.id}`)
            let authorBank = db.get(`bank_${interaction.user.id}`)

            if(wallet == null) wallet = 0; //if the wallet db is null, it will show 0 in the wallet variable
            if(bank == null) bank = 0; //if bank db is null, it will show 0 in the bank variable

            if(authorWallet == null) authorWallet = 0; //set the authorWallet var to 0
            if(authorBank == null) authorBank = 0; //set the authorBank var to 0

            if(!user) { //if the user didn't select any user in option
                let authorEmbed = new MessageEmbed() //create a new embed message
                .setTitle(`${interaction.user.username}'s Balance`)
                .setDescription(`**Wallet:** ${authorWallet}\n**Bank:** ${authorBank}`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                interaction.reply({ embeds: [authorEmbed] })
            } else { //the user that selected user in option
                let userEmbed = new MessageEmbed() //create a new embed message
                .setTitle(`${user.username}'s Balance`)
                .setDescription(`**Wallet:** ${wallet}\n**Bank:** ${bank}`)
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                interaction.reply({ embeds: [userEmbed] })
            }
        }
};