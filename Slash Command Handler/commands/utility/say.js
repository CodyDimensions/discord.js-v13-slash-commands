module.exports = {
    name: 'say',
    description: 'Say a message with the bot.',
    run: async(client, message, args) => {
        let msg;
        let textchannel = message.mentions.channels.first() //find the channel you mention in the cmd
        message.delete()
        if(!message.member.permissions.has('MANAGE_MESSAGES')) { //need manager messages permission to prevent people use this cmd wrong
            return message.reply('**You do not have permission to use this command.**') //like sending the msg to announcement channel...
        } else if(!args[0]) { // if you did not type what you wanna say, then the bot will return a message to you
            return message.reply('**Please specify what you want to say!**')
        }else if(textchannel) { //if you mention the channel you want to send the message
            msg = args.slice(1).join(' '); // for example: !say #general hello
            textchannel.send(msg) //then it will send that message to the channel you mention
        }else{
            msg = args.join(' '); //this code is for getting the message you want to send
            message.channel.send(msg)//then send to your message channel
        }
    }
}