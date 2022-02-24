const fs = require("fs");

// Import command files
const objects = require(`../objects.js`);
const client = objects.client;

async function record(message) {
    const channel = message.member.voice.channel;
    if (!channel) return message.channel.send('Nu esti pe un canal de voice.');
    if (client.voice.connections.size > 0) {
        return message.channel.send("Sunt ocupat acum sa cant!");
    }
    const connection = await channel.join();
    const receiver = connection.receiver.createStream(message.member, {
        mode: "pcm",
        end: "silence"
    });
    const writer = receiver.pipe(fs.createWriteStream(`./src/record/recorded-${message.author.id}.pcm`));
    writer.on("finish", () => {
        message.member.voice.channel.leave();
        message.channel.send("Am terminat de inregistrat");
    });
}


module.exports = {
    name: 'record',
    aliases: ['rec', 'inregistreaza'],
    utilisation: '{prefix}record',

    execute(message) {
        const args = message.content.split(" ");
        record(message);
        return;
    },
}