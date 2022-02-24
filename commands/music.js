const objects = require(`./objects.js`);
const client = objects.client;
const queue = objects.queue;

const ytdl = require(`ytdl-core`);
const yts = require(`yt-search`);
const youtube = require('youtube-sr').default;
const { getData, getPreview, getTracks } = require('spotify-url-info');

var loop_ind = 0; // Loop piesa
var loop_queue_ind = 0; // Loop coada
var current_seek = 0; // Daca s-a facut deja seek pe melodia curenta == 1
var stream;
var prefix = objects.prefix;
const { Player } = require('discord-player');


//  PLAY FUNCTIONS 
async function start(message, serverQueue) {
    const args = message.content.split(" ");
    if (args[1].includes("spotify")) {
        let data = await getData(args[1]);
        message.content = data.name + ' ' + data.artists[0].name;// + ' ' + data.album.name;
        //console.log (message.content);
        if (data) {
            execute(message, serverQueue);
        }
        else {
            message.channel.send("Nu s-au gasit piese!");
        }
        return;
    }
    if (args[1].includes("list")) {
        playlist(message, serverQueue);
        return;
    }
    else {
        execute(message, serverQueue);
        return;
    }
}


function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }
    stream = ytdl(song.url);
    //stream = song.url;
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url, { filter: "audioonly" }))
        .on("finish", () => {
            if (loop_ind === 0) {
                !
                    serverQueue.songs.shift();
            }
            if (loop_queue_ind === 1) {
                serverQueue.songs.push(song);
            }
            play(guild, serverQueue.songs[0]);
            serverQueue.playing = true;
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Piesa curenta: **${song.title}**`);
}


async function execute(message, serverQueue) {
    const args = message.content.split(" ");
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Trebuie sa fii conectat pe un channel de voice.");
    if (client.voice.connections.size > 0) {
        const inSameChannel = client.voice.connections.some((connection) => connection.channel.id === message.member.voice.channelID)
        if (!inSameChannel) return message.channel.send('Botul este utilizat pe alt canal de voice.')

    }
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send("Nu am permisiune sa intru pe canalul de voice.");
    }

    //const songInfo = await ytdl.getInfo(args[1]);
    //const songInfo = await ytdl.getInfo(args[1]+' ' + args[2]+' ' + args[3]);
    // PLAYLIST PRIMA PIESA
    let song;
    const SongURL = args[1].split("&");
    let song_split = SongURL[0];
    args[1] = song_split;

    if (ytdl.validateURL(song_split)) {
        try {
            // Pusa de mine pentru a rezolva problema cu linkul
            song = {
                title: undefined,
                url: undefined,
            };
            const songInfo = await ytdl.getInfo(song_split).then(info => {
                song.title = info.videoDetails.title;
                song.url = song_split;
            });

            /*
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.video_url,
            };
            */
            let verif = song.url;
            if (!verif) {
                message.channel.send("FDGHREH " + song.title);
                const { videos } = await yts(args.slice(1).join(" "));
                if (!videos[0]) return message.channel.send("Nu s-au gasit piese!");
                song = {
                    title: videos[0].title,
                    url: videos[0].url,
                };
                message.channel.send("TITLU: " + song.title);
            }
        } catch (error) {
            console.error(error);
            return message.reply(error.message).catch(console.error);
        }
    }
    else {
        try {
            const { videos } = await yts(args.slice(1).join(" "));
            if (!videos[0]) return message.channel.send("Nu s-au gasit piese!");
            song = {
                title: videos[0].title,
                url: videos[0].url,
            };
        } catch (error) {
            console.error(error);
            return message.reply(error.message).catch(console.error);
        }
    }
    if (!serverQueue) {
        // Creating the contract for our queue
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
        };
        // Setting the queue using our contract
        queue.set(message.guild.id, queueContruct);
        // Pushing the song to our songs array
        queueContruct.songs.push(song);
        try {
            // Here we try to join the voicechat and save our connection into our object.
            var connection = await voiceChannel.join();
            queueContruct.connection = connection;
            // Calling the play function to start a song
            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            // Printing the error message if the bot fails to join the voicechat
            console.log(err);
            queue.delete(message.guild.id);
            return message.channel.send(err);
        }

    } else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`${song.title} a fost adaugat in coada.`);
    }
}

// Playlist

function add_playlist(message, serverQueue, playlist, videosObj) {
    let lenght_videos = videosObj.length;
    if (lenght_videos > 20) {
        lenght_videos = 20;
    }
    let song;
    for (let i = 1; i < lenght_videos; i++) {
        message.content = videosObj[i].title;
        song = {
            title: videosObj[i].title,
            url: videosObj[i].url,
        };
        const serverQueue = queue.get(message.guild.id);
        serverQueue.songs.push(song);
    }
}

async function playlist(message, serverQueue) {
    const args = message.content.split(" ");
    try {
        const playlist = await youtube.getPlaylist(args[1]); // get playlist data 
        let videosObj = await playlist.fetch(); // songs data object
        videosObj = videosObj.videos;
        message.content = "play " + videosObj[0].title;
        execute(message, serverQueue);
        message.channel.send("Playlist-ul a fost adaugat in coada.");
        setTimeout(add_playlist, 2000, message, serverQueue, playlist, videosObj);
    } catch (err) {
        console.error(err);
        return message.channel.send('Playlist-ul nu a putut fi gasit.');
    }
}

// END OF PLAY FUNCTIONS

// SKIP
function skip(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu e nimic de dat skip.");
    if (loop_ind === 1) {
        serverQueue.songs.shift();
    }
    loop_ind = 0;
    serverQueue.connection.dispatcher.end();
    if (!serverQueue.songs.length) {
        serverQueue.voiceChannel.leave();
        queue.delete(message.guild.id);
        return;
    }
}

// LOOP
function loop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu cant nimic in momentul acesta.");
    if (loop_ind === 0) {
        message.channel.send("Piesa actuala va fi repetata la nesfarsit.");
        loop_ind = 1;
    } else {
        message.channel.send("Piesa actuala nu va mai fi repetata.");
        loop_ind = 0;
    }
}

// LOOP QUEUE
function loop_queue(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu cant nimic in momentul acesta.");
    if (loop_queue_ind === 0) {
        message.channel.send("Coada de piese va fi reluata.");
        loop_queue_ind = 1;
        return;
    } else {
        loop_queue_ind = 0;
        message.channel.send("Coada de piese nu va mai fi reluata.");
    }
    return;
}

// PAUSE
function pause(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu cant nimic in momentul acesta.");
    if (serverQueue.playing === true) {
        serverQueue.connection.dispatcher.pause();
        serverQueue.connection.dispatcher.resume();
        serverQueue.connection.dispatcher.pause();
        serverQueue.playing = false;
        message.channel.send("Am oprit piesa.");
        return;
    } else {
        message.channel.send("Piesa este deja oprita. O voi reporni. Pe viitor, foloseste /resume");
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return;
    }
}

// RESUME
function resume(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu cant nimic in momentul acesta.");
    if (serverQueue.playing === false) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        message.channel.send("Am inceput iar sa cant.");
    } else {
        message.channel.send("Piesa nu este oprita.");
    }
}

// SEEK
async function seek(message, serverQueue) {
    const args = message.content.split(" ");
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu cant nimic in momentul acesta.");
    if (!args[1]) {
        return message.channel.send("Introdu un numar valid de secunde unde vrei sa ajungem.");
    }
    if (current_seek) {
        return message.channel.send("S-a dat deja seek pe melodia curenta.");
    }
    const time = args[1];
    const songa = stream;
    current_seek = 1;
    const dispatcher = serverQueue.connection
        .play(songa, { filter: 'audioonly', seek: parseInt(time) })
        .on("finish", () => {
            current_seek = 0;
            if (loop_ind === 0) {
                serverQueue.songs.shift();
            }
            if (loop_queue_ind === 1) {
                serverQueue.songs.push(song);
            }
            play(message.guild, serverQueue.songs[0]);
            serverQueue.playing = true;
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Piesa curenta a fost avansata cu ` + time + " secunde fata de inceput.");
}

// SEARCH
function ytsearch(message, serverQueue) {
    var count = 0;
    var args = message.content.trim().split(/ +/g);
    yts(args.join(' '), function (err, res) {
        if (err) return message.channel.send('Ceva nu a functionat corect.');
        let videos = res.videos.slice(0, 5);
        let resp = '';
        for (var i in videos) {
            resp += `**[${parseInt(i) + 1}]:** \`${videos[i].title}\`\n`;
        }
        resp += `\n**Alege ce piesa vrei sa cante: (trimite mesaj doar cu numarul) \`1-${videos.length}\`**`;
        message.channel.send(resp);
        client.on('message', async message => {
            if (count == 2) return;
            count++;
            if (message.author.bot || !message.guild) return;
            if (message.content < 6 && message.content > 0) {
                message.content = `${prefix}play ` + videos[message.content - 1].title;
                execute(message, serverQueue);
                return;
            }
            else {
                message.channel.send("Nu ai introdus un numar valid. Cautare anulata.");
                ok = 1;
                return;
            }
        });
    });
}

// PRINT QUEUE
function print_queue(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu cant nimic in momentul acesta.");
    var i = 0;
    message.channel.send("Lista de melodii: \n");
    while (serverQueue.songs[i] != null) {
        message.channel.send(i + 1 + '.' + ' ' + serverQueue.songs[i].title);
        i++;
    }

}

// STOP
function stop(message, serverQueue) {
    if (!message.member.voice.channel)
        return message.channel.send("Trebuie sa fii conectat pe voice channel.");
    if (!serverQueue)
        return message.channel.send("Nu e nimic de stopat.");
    serverQueue.songs = [];
    serverQueue.playing = false;
    serverQueue.connection.dispatcher.end();
    serverQueue.voiceChannel.leave();
}

module.exports = { start, skip, loop, loop_queue, pause, resume, seek, ytsearch, print_queue, stop }