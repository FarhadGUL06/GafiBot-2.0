const Discord = require('discord.js');

module.exports = {
    name: 'serverinfo',
    aliases: ['serverinfo'],
    utilisation: '{prefix}serverinfo',

    execute(message) {
        const ServerLogo = message.guild.iconURL();
        const ServerInfoEmbed = new Discord.MessageEmbed()
            .setColor("BLUE")
            .setTitle("Informatii server")
            .setThumbnail(ServerLogo)
            .setDescription(`Grupa este **${message.guild}**`)
            .setURL(ServerLogo)
            .addField("**Data fondarii**", `Serverul a fost creat pe **${message.guild.createdAt.toLocaleString()}**`)
            .addField("**Seful serverului**", `Detinatorul serverului este ${message.guild.owner}`)
            .addField("**Numarul de membri**", "Serverul are ` " + `${message.guild.memberCount}` + " ` **membri**")
            .addField("**Numarul de grade**", "Serverul are ` " + `${message.guild.roles.cache.size}` + " ` **grade**")
            .addField("**Numarul de canale**", "Serverul are ` " + `${message.guild.channels.cache.size}` + " ` **canale**")
            .addField("**Numarul de emoji-uri**", "Serverul are ` " + `${message.guild.emojis.cache.size}` + " ` **emoji-uri**")
        message.channel.send(ServerInfoEmbed)
    },

}