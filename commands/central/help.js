// Import command files
const objects = require(`../objects.js`);
var prefix = objects.prefix;


module.exports = {
    name: 'help',
    aliases: ['h'],
    showHelp: false,
    utilisation: '{prefix}help',

    execute(message) {
        const args = message.content.split(" ");

        // MENIU PRINCIPAL
        if (!args[1]) {
            prefix = objects.prefix;
            message.channel.send("HELP PRINCIPAL");
            message.channel.send(`Pentru help pe categorii, incearca urmatoarele: \n${prefix}help muzica - informatii muzica\n${prefix}help central - comenzi utilizator\n${prefix}help record - comenzi de inregistrare voce\n${prefix}help memes - comenzi de memes\n${prefix}help weather - informatii despre vreme`);
            return;
        }

        // HELP MUZICA
        if (args[1].includes("muzica")) {
            prefix = objects.prefix;
            message.channel.send("HELP PE MUZICA");
            message.channel.send(
                `${prefix}play sau ${prefix}p sau ${prefix}canta + LINK VIDEO / cuvinte cheie - poti pune muzica folosind link-ul la video, cuvinte cheie sau chiar un playlist (se incarca primele 20 de piese)\n${prefix}stop - opreste muzica si curata coada\n${prefix}skip sau ${prefix}sari - sare peste piesa curenta\n${prefix}seek + nr de secunde - sare cu nr de secunde fata de inceput (doar o data pe melodie)\n${prefix}loop sau ${prefix}repeta - pune piesa curenta in loop / sau scoate din loop\n${prefix}loop queue sau ${prefix}repeta coada - pune coada de piese pe repeat\n${prefix}pause sau ${prefix}pauza - pune muzica pe pauza\n${prefix}resume sau ${prefix}reia - porneste iar muzica\n${prefix}search sau ${prefix}cauta - cauta piese folosind cuvinte cheie\n${prefix}queue sau ${prefix}coada - afiseaza lista de melodii\n`);
            return;
        }

        // HELP COMENZI CENTRALE
        if (args[1].includes("central")) {
            prefix = objects.prefix;
            message.channel.send("HELP CENTRAL");
            message.channel.send(
                `${prefix}serverinfo - afiseaza informatii despre server\n${prefix}userinfo - afiseaza informatii despre tine\n${prefix}userinfo + mention_user - afiseaza informatii despre mention_user\n${prefix}av - afiseaza avatarul tau\n${prefix}av + mention_user - afiseaza avatarul celui mentionat.\n${prefix}prefix + prefixul indicat din cele disponibile (['!', '#', '&', '-', "/"]) - schimba prefixul\n${prefix}prefix reset - reseteaza prefixul pe "!"`);
            return;
        }

        // HELP INREGISTRARE
        if (args[1].includes("record")) {
            prefix = objects.prefix;
            message.channel.send("HELP RECORD");
            message.channel.send(
                `${prefix}record sau ${prefix}inregistreaza - inregistreaza pana in momentul opririi din vorbit a celui care a introdus comanda\n${prefix}playrec sau ${prefix}reda - reda ultima inregistrare efectuata`);
            return;
        }

        // HELP MEMES
        if (args[1].includes("memes")) {
            prefix = objects.prefix;
            message.channel.send("HELP MEMES");
            message.channel.send(
                `${prefix}amogos sau ${prefix}mogos - afiseaza un meme random\n${prefix}amogos sau ${prefix}mogos + numar - afiseaza meme-ul indicat\n${prefix}odo nb - noapte buna de la odo\n${prefix}odo check - verifica numarul de utilizatori si comenteaza pe situatia curenta\n${prefix}olaru ciuruit - Ii ciuruiesc!\n${prefix}saracin ms / multumesc (cu / fara prefix) - Multumesc frumos pentru raspuns!\n${prefix}saracin hello (cu / fara prefix) - Hello!\n${prefix}saracin pace (cu / fara prefix) - Nu va mai certati!\n${prefix}dorinel sens (cu / fara prefix) - Dazitmeicsens\n${prefix}bobaru cringe (cu / fara prefix) - cringe`);
            return;
        }
        // HELP WEATHER
        if (args[1].includes("weather")) {
            prefix = objects.prefix;
            message.channel.send("HELP WEATHER");
            message.channel.send(
                `${prefix}weather / vreme / w + oras - afiseaza vremea, data si ora din orasul respectiv\n${prefix}meteo / weather / vreme / w (fara parametrii) - afiseaza vremea, data si ora din Bucuresti`);
            return;
        }
        return;
    },
}
