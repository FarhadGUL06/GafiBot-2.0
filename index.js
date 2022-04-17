const prefixes = ['!', '#', '&', '-', "/"];
var prefix = '!';

// Import command files
const objects = require(`./commands/objects.js`);
const client = objects.client;
objects.prefix = prefix;

// Central commands
const help = require(`./commands/central/help.js`);
const avatar = require(`./commands/central/avatar.js`);
const userinfo = require(`./commands/central/userinfo.js`);
const serverinfo = require(`./commands/central/serverinfo.js`);
const zicala = require(`./commands/central/zicala.js`);
const memes = require(`./commands/central/memes.js`);


// Music commands
const music = require(`./commands/music.js`);


// Record commands
const record = require(`./commands/record/record.js`);
const playrec = require(`./commands/record/playrec.js`);


const { exit } = require('process');
const { platform } = require('os');
const { VoiceUtils } = require('discord-player');
const { VoiceChannel } = require('discord.js');

const queue = objects.queue;

client.once('ready', () => {
    client.user.setActivity('on 324CC')
    console.log('Ready!');
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('message', async message => {
    if (message.author.bot || !message.guild) return;
    if (!message.content.startsWith(prefix)) {
        // Daca nu incepe cu prefix
        return;
    }
    if (message.content.startsWith(prefix)) {
        // Daca incepe cu prefix

        /// Central commands
        // HELP
        if (message.content.startsWith(`${prefix}help`) || message.content.startsWith(`${prefix}ajutor`)) {
            help.execute(message);
            return;
        }
        // AVATAR 
        if (message.content.startsWith(`${prefix}av`)) {
            avatar.execute(message);
            return;
        }
        // USERINFO
        if (message.content.startsWith(`${prefix}userinfo`)) {
            userinfo.execute(message);
            return;
        }
        // SERVERINFO
        if (message.content.startsWith(`${prefix}serverinfo`)) {
            serverinfo.execute(message);
            return;
        }
        // ZICALA
        if (message.content.startsWith(`${prefix}zicala`)) {
            zicala.execute(message);
            return;
        }
        // CHANGE PREFIX
        if (message.content.startsWith(`${prefix}prefix`)) {
            const args = message.content.split(" ");
            if (!args[1]) {
                return message.channel.send(`Trebuie sa introduci un prefix. Exemplu: ${prefix}prefix # -> va schimba prefixul in '#'. `);
            }
            if (args[1].includes("reset")) {
                prefix = '!';
                objects.prefix = prefix;
                return message.channel.send(`Prefixul a fost resetat in ${prefix}`);
            }
            if (prefixes.includes(args[1])) {
                prefix = args[1];
                objects.prefix = prefix;
                return message.channel.send(`Prefixul a fost schimbat in ${prefix}`);
            }
            return message.channel.send(`Prefixul introdus nu este permis!`);;
        }

        // Record commands
        // RECORD 
        if (message.content.startsWith(`${prefix}record`) || message.content.startsWith(`${prefix}inregistreaza`)) {
            record.execute(message);
            return;
        }
        // PLAYREC
        if (message.content.startsWith(`${prefix}playrec`) || message.content.startsWith(`${prefix}reda`)) {
            playrec.execute(message);
            return;
        }

        // Music commands
        const serverQueue = queue.get(message.guild.id);
        // PLAY
        if (message.content.startsWith(`${prefix}play `) || message.content.startsWith(`${prefix}canta`) || message.content.match(`${prefix}p `)) {
            music.start(message, serverQueue);
            return;
        }
        // SKIP
        if (message.content.startsWith(`${prefix}skip`) || message.content.startsWith(`${prefix}sari`)) {
            music.skip(message, serverQueue);
            return;
        }
        // LOOP QUEUE
        if (message.content.startsWith(`${prefix}loop queue`) || message.content.startsWith(`${prefix}repeta coada`)) {
            music.loop_queue(message, serverQueue);
            return;
        }
        // LOOP TRACK
        if (message.content.startsWith(`${prefix}loop`) || message.content.startsWith(`${prefix}repeta`)) {
            music.loop(message, serverQueue);
            return;
        }
        // PAUSE
        if (message.content.startsWith(`${prefix}pause`) || message.content.startsWith(`${prefix}pauza`)) {
            music.pause(message, serverQueue);
            return;
        }
        // RESUME
        if (message.content.startsWith(`${prefix}resume`) || message.content.startsWith(`${prefix}reia`)) {
            music.resume(message, serverQueue);
            return;
        }
        // SEEK
        if (message.content.startsWith(`${prefix}seek`)) {
            music.seek(message, serverQueue);
            return;
        }
        // YOUTUBE SEARCH
        if (message.content.startsWith(`${prefix}search`) || message.content.startsWith(`${prefix}cauta`)) {
            music.ytsearch(message, serverQueue);
            return;
        }
        // QUEUE
        if (message.content.startsWith(`${prefix}queue`) || message.content.startsWith(`${prefix}coada`)) {
            music.print_queue(message, serverQueue);
            return;
        }
        // STOP
        if (message.content.startsWith(`${prefix}stop`) || message.content.startsWith(`${prefix}opreste`)) {
            music.stop(message, serverQueue);
            return;
        }
        // COMENZI MEMES
        if (message.content.includes("mogos")) {
            memes.mogos(message);
            return;
        }
        if (message.content.includes("odo")) {
            memes.odo(message);
            return;
        }
        if (message.content.includes("rd")) {
            memes.rd(message);
            return;
        }
        if (message.content.includes("olaru")) {
            memes.olaru(message);
            return;
        }
        if (message.content.includes("saracin")||message.content.includes("ms")||message.content.includes("multumesc")
			||message.content.includes("pace") ||message.content.includes("hello")) {
            memes.saracin(message);
            return;
        }
        if (message.content.includes("dorinel")||message.content.includes("sens")) {
            memes.dorinel(message);
        return;
        }    
        message.channel.send("Comanda nu este implementata!");
        return;
    }
})

client.on('voiceStateUpdate', (oldState, newState) => {
    // check if someone connects or disconnects
    if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
    // check if the bot is disconnecting
    if (newState.id !== client.user.id) return;
    // clear the queue
    return queue.delete(oldState.guild.id);

});

client.login(process.env.BOT_TOKEN);
