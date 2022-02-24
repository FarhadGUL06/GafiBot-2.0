const fs = require("fs");

// Import command files
const objects = require(`../objects.js`);
const client = objects.client;

async function reda(message) {
    const voicechannel = message.member.voice.channel;
    if (!voicechannel) return message.channel.send("Nu esti pe un canal de voice.");
    if (client.voice.connections.size > 0) {
        return message.channel.send("Sunt ocupat acum sa cant!");
    }
    if (!fs.existsSync(`./src/record/recorded-${message.author.id}.pcm`)) return message.channel.send("Nu a putut fi inregistrat.");

    const connection = await message.member.voice.channel.join();
    const stream = fs.createReadStream(`./src/record/recorded-${message.author.id}.pcm`);

    const dispatcher = connection.play(stream, {
        type: "converted"
    });

    dispatcher.on("finish", () => {
        message.member.voice.channel.leave();
        return message.channel.send("S-a terminat inregistrarea.");
    })
}

module.exports = {
    name: 'reda',
    aliases: ['recdone', 'reda'],
    utilisation: '{prefix}reda',

    execute(message) {
        reda(message);
        return;
    },
}