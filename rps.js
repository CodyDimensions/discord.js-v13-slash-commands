const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rps') // name of your slash command
    .setDescription('Rock Paper Scissors!'), // description of your slash command
    async execute(client, interaction) {
        let hand = [ // Defining moves
            {
                txt: 'Rock',
                emoji: '✊',
                index: 0
            },
            {
                txt: 'Paper',
                emoji: '🤚',
                index: 1
            },
            {
                txt: 'Scissors',
                emoji: '✌️',
                index: 2
            }
        ];

        let botMove = hand[Math.floor(Math.random() * 3)]; // Making random moves 

        const rpsMsg = await interaction.reply({
            embeds: [
                new MessageEmbed() // embed 
                .setColor('GREEN')
                .setTitle('Rock Paper Scissors')
                .setDescription('Choose a handsign!')
                .setImage('https://static.vecteezy.com/system/resources/previews/000/691/497/non_2x/rock-paper-scissors-neon-icons-vector.jpg')
            ],
            components: [ // components 
                new MessageActionRow()
                .addComponents(
                    new MessageButton() // making the rock button
                        .setCustomId('rps_rock') // set the custom id to rps_rock, we will use it later
                        .setLabel('✊ Rock')
                        .setStyle('PRIMARY') ,// there is different styles of buttons you can use, it is simply different colors buttons. 
                    new MessageButton() // make the paper button
                        .setCustomId('rps_paper')
                        .setLabel('🤚 Paper')
                        .setStyle('PRIMARY'),
                    new MessageButton() // make the scissor button
                    .setCustomId('rps_scissors')
                    .setLabel('✌️Scissors')
                    .setStyle('PRIMARY')
                )
            ],
            fetchReply: true  // we will edit the message later
        });

        // define variables
        let win =  0; // 0 is Loss, 1 is Tie and 2 is win
        let userMove; 

        const filter = interaction => !interaction.user.bot; // filter out bots
        const collector = interaction.channel.createMessageComponentCollector({ // create a message component collctor with some options below
            filter, // apply the filter defined above
            componentType: 'BUTTON', // button collector
            time: 10000 // 10 seconds
        });

        collector.on('collect', async (i) => {
            if(!i.isButton()) return; // if collected is not button then return

            if(i.customId.startsWith('rps')) {
                await i.deferUpdate(); // deferring the interaction so it will not load so long
                let move = i.customId.split('_')[1] // split the button custom ID to 2 parts (it will split in the _ ), and define the hand sign which is rock, paper and scissors as the variable
                userMove = hand.find(v => v.txt.toLowerCase() == move); // find the object which  name property is equals to the move variable which is rock, paper and scissors from the hand array defined above 

                switch(move) { // a switch statement
                    case 'rock': 
                        win = botMove.index == 0 ? 1 : (botMove.index == 1 ? 0 : 2);  
                        break;
                    case 'paper': 
                        win = botMove.index == 0 ? 2 : (botMove.index == 1 ? 1 : 0); 
                        break;
                    case 'scissors':
                        win =  botMove.index == 0 ? 0 : (botMove.index == 1 ? 2 : 1); 
                        break;
                }

                let embed = rpsMsg.embeds[0]; // get the embed that sent before
                // edit the embed
                embed.color = 'BLUE';
                embed.description = `I choose ${botMove.txt}! ${win == 0 ? 'You lost!' : (win == 1 ? 'We tied!' : 'You win!')} (${userMove.emoji} ${win == 0  ? '<' : (win == 1 ? '=' : '>')} ${botMove.emoji})`;

                let components = rpsMsg.components// get the components which are buttons that sent before
                // Disabling all buttons
                components[0].components.forEach(comp => {
                    if(comp.customId == i.customId) {
                        comp.disabled = true; // disable the button
                        comp.style = 'SECONDARY'; // change the style of the button, color is gray
                    } else comp.disabled = true;
                });

                // edit the message
                await rpsMsg.edit({ embeds: [embed], components: components, fetchyReply: true });

                collector.stop() // stop the message component collector
            }
        });
    },
};
