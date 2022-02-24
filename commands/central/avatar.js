const Discord = require('discord.js');

module.exports = {
    name: 'avatar',
    aliases: ['av'],
    utilisation: '{prefix}avatar',

    execute(message) {
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()
                .setTitle(message.author.username)
                .setColor(0x00ffff)
                .setImage(message.author.displayAvatarURL({ format: 'png', size: 512 }));
            return message.channel.send(embed);
        }
        const mention = message.mentions.members.first();
        const Embed = new Discord.MessageEmbed()
            .setTitle(message.mentions.users.first().username)
            .setColor(0x00ffff)
            .setImage(mention.user.displayAvatarURL({ format: 'png', size: 512 }));
        return message.channel.send(Embed);
    },

}