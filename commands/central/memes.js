const { VoiceChannel } = require("discord.js");
const fs = require("fs");

// Import command files
const objects = require(`../objects.js`);
const client = objects.client;

var numberPhotos = 15;

function mogos(message) {
  const args = message.content.split(" ");

  if (args[1] <= numberPhotos) {
    // Poza specifica
    return message.channel.send({ files: [`./src/mogos/${parseInt(args[1])}.png`] })
  }

  if (!args[1] || args[1] > numberPhotos) {
    // Poza random
    const rndInt = Math.floor(Math.random() * numberPhotos) + 1;
    return message.channel.send({ files: [`./src/mogos/${parseInt(rndInt)}.png`] })
  }
  return;
}

async function rd(message) {
  const args = message.content.split(" ");
  if (!args[1]) {
    return message.channel.send("Comenzi disponibile pentru Diaconexu: laugh / ras.");
  }
  if ((args[1].includes("laugh"))||(args[1].includes("ras"))) {
    const voicechannel = message.member.voice.channel;
    if (!voicechannel) return message.channel.send("Nu esti pe un canal de voice.");
    if (client.voice.connections.size > 0) {
      return message.channel.send("Sunt ocupat acum sa cant!");
    }

    let fileName = "rdlaugh"; // Numele fisierului urmat sa se deschida

    if (!fs.existsSync(`./src/rd/${fileName}.pcm`)) return message.channel.send("Nu a fost gasita sursa.");

    const connection = await message.member.voice.channel.join();
    const stream = fs.createReadStream(`./src/rd/${fileName}.pcm`);

    const dispatcher = connection.play(stream, {
      type: "converted"
    });
    dispatcher.setVolumeLogarithmic(10);
    dispatcher.on("finish", () => {
      message.member.voice.channel.leave();
      return;
    })
    return;
  }
  message.channel.send("Comenzi disponibile pentru Diaconexu: laugh / ras.");
  return;
}

async function odo(message) {
  const args = message.content.split(" ");
  if (!args[1]) {
    return message.channel.send("Comenzi disponibile: check si nb.");
  }
  if (args[1].includes("check")) {
    const voicechannel = message.member.voice.channel;
    if (!voicechannel) return message.channel.send("Nu esti pe un canal de voice.");
    if (client.voice.connections.size > 0) {
      return message.channel.send("Sunt ocupat acum sa cant!");
    }

    // Variabile de lucru
    var numberVoice = voicechannel.members.size; // Numarul de persoane
    var numberCompareTo = 6; // Valoarea de comparat
    let fileName; // Numele fisierului urmat sa se deschida

    if (numberVoice < numberCompareTo) {
      fileName = "prez_mica";
    }
    else {
      fileName = "prez_mare";
    }
    if (!fs.existsSync(`./src/odo/${fileName}.pcm`)) return message.channel.send("Nu a fost gasita sursa.");

    const connection = await message.member.voice.channel.join();
    const stream = fs.createReadStream(`./src/odo/${fileName}.pcm`);

    const dispatcher = connection.play(stream, {
      type: "converted"
    });
    dispatcher.setVolumeLogarithmic(10);
    dispatcher.on("finish", () => {
      message.member.voice.channel.leave();
      return;
    })
    return;
  }

  if (args[1].includes("nb") || args[1].includes("noapte")) {
    const voicechannel = message.member.voice.channel;
    if (!voicechannel) return message.channel.send("Nu esti pe un canal de voice.");
    if (client.voice.connections.size > 0) {
      return message.channel.send("Sunt ocupat acum sa cant!");
    }
    if (!fs.existsSync(`./src/odo/nb.pcm`)) return message.channel.send("Nu a fost gasita sursa.");

    const connection = await message.member.voice.channel.join();
    const stream = fs.createReadStream(`./src/odo/nb.pcm`);

    const dispatcher = connection.play(stream, {
      type: "converted"
    });
    dispatcher.setVolumeLogarithmic(10);
    dispatcher.on("finish", () => {
      message.member.voice.channel.leave();
      return message.channel.send("Noapte buna!");
    })
    return;
  }
  message.channel.send("Comenzi disponibile: check si nb.");
  return;
}

module.exports = { mogos, rd, odo }
