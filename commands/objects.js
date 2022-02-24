
const Discord = require('discord.js');
const youtube = require('youtube-sr').default;


const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"] });

const queue = new Map();
var prefix;

module.exports = { queue, client, youtube, prefix }