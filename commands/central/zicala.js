module.exports = {
  name: 'zicala',
  aliases: ['zicala'],
  utilisation: '{prefix}zicala',

  execute(message) {
    const zicale = ["Nu dai putere oricui prost", "Important e sa si dai cand furi", "Sanatate ca noroc aveau si aia pe titanic", "Asculta totul dar sa nu crezi totul", "Cine se acuza se scuza", "Cine nu spune nimic, nu gandeste mai putin", "Esti ceea ce mananci", "Prostul rade de trei ori: o data cand rad ceilalti, o data cand intelege gluma si inca o data cand isi da seama ca a ras fara sa inteleaga", "Ciupercile otravitoare cresc cel mai repede", "Woher comzdu?", "Fii fericit cat traiesti, pentru ca mort o sa fii mult timp"];

    const rndInt = Math.floor(Math.random() * 12) + 1;
    message.channel.send(zicale[rndInt]);
    return;
  },
}