
const Discord = require('discord.js');
const weather = require('weather-js');

// Import command files
const objects = require(`../objects.js`);
const client = objects.client;
var prefix = objects.prefix;

async function meteo(message) {
  const args = message.content.split(" ");
  if (!args[1]) {
    message.content = message.content + " Bucuresti";
    meteo (message);
    return;
  }
  var town = message.content;
  var index_rem = town.indexOf(' ');
  town = town.substring(index_rem + 1);
  weather.find({search: town, degreeType: 'C'}, function (error, result){
    // 'C' can be changed to 'F' for farneheit results
    if(error) return message.channel.send(error);

    if(result === undefined || result.length === 0) return message.channel.send('Locatie invalida.');

    var current = result[0].current;
    var location = result[0].location;
    var date = new Date();
    var offset = location.timezone;
    var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*offset));

    const weatherinfo = new Discord.MessageEmbed()
    .setDescription(`**${current.skytext}**`)
    .setAuthor(`GafiBot - Prezintă vremea`)
    .setThumbnail(current.imageUrl)
    .setColor(0x2c56d4)
    .addField('Oraș', `${town}`, true)
    .addField('Temperatura', `${current.temperature}° C`, true)
    .addField('Vânt', current.winddisplay, true)
    //     .addField('Timezone', `UTC ${location.timezone}`, true)
    .addField('Data și ora locație', `${nd.toLocaleString()}`, true)
    .addField('Temperatura resimțită', `${current.feelslike}° C`, true)
    .addField('Umiditate', `${current.humidity}%`, true)


    message.channel.send(weatherinfo)
    })        
}     


module.exports = { meteo }
