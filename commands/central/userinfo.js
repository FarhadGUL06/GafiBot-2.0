const Discord = require('discord.js');

module.exports = {
  name: 'userinfo',
  aliases: ['userinfo'],
  utilisation: '{prefix}userinfo',

  execute(message) {
    const args = message.content.split(" ");
    if (!args[1]) {
      var user = message.author;
    } else var user = message.mentions.users.first();
    const member = message.guild.member(user);
    const activities = [];
    for (const activity of user.presence.activities.values()) {
      switch (activity.type) {
        case 'PLAYING':
          activities.push(`Playing **${activity.name}**`);
          break;
        case 'LISTENING':
          if (user.bot) activities.push(`Listening to **${activity.name}**`);
          else activities.push(`Listening to **${activity.details}** by **${activity.state}**`);
          break;
        case 'WATCHING':
          activities.push(`Watching **${activity.name}**`);
          break;
        case 'STREAMING':
          activities.push(`Streaming **${activity.name}**`);
          break;
        case 'CUSTOM_STATUS':
          customStatus = activity.state;
          break;
      }
    }
    const infoEmbed = new Discord.MessageEmbed()
      .setColor("BLUE")
      .setTitle(`Informatii despre ${user.username}`)
      .setDescription(`Serverul curent: ${message.guild.name}`)
      .setThumbnail(user.avatarURL({ dynamic: true }))
      .setFooter('requested')
      .setTimestamp()
      .addFields(
        {
          name: "Informatii",
          value: "```Nume de utilizator: " + user.username + "\nDiscriminator: #" + user.discriminator + "\nTag: " + user.tag + "\nServer Nickname: " + member.displayName + "\nEste bot?: " + user.bot + "\nID: " + user.id + " ```",
          inline: true
        },
        /*{
            name: `Status`,
            value: "```"+member.user.presence.status+"\n"+activities+"```",
            inline: false
        },*/
        {
          name: `Istoric`,
          value: "```Pe server din: " + new Date(user.joinedAt).toLocaleDateString() + "\nPe discord din: " + new Date(user.createdTimestamp).toLocaleDateString() + "```",
          inline: true
        },
        {
          name: `Grade`,
          value: "" + member.roles.cache.map(r => r).join(' | ') + "",
          inline: false
        },


      )

    return message.channel.send(infoEmbed)
  },
}