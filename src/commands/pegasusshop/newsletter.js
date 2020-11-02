/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const md5 = require("md5");
const { format } = require("date-fns");
const { fetchWithTimeout } = require("./../../utils");

exports.run = async (bot, msg) => {
  const collectorMessage = await msg.author.send("Wie lautet deine Email-Adresse?");

  const filter = (response) => /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(response);

  collectorMessage.channel
    .awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
    .then(async (collected) => {
      const email = collected.first().content;

      const hash = md5(format(new Date(), "ddMMyyyy") + email + process.env.NEWSLETTER_SECRET);

      try {
        const resp = await fetchWithTimeout(`https://pegasusshop.de/saveNewNewsletter/subscribeToNewsletter?&newsletter=${email}&subscribeToNewsletter=1&newslettergroup=1&crypt=${hash}`);

        if (resp.status !== 200) throw new Error();
        await msg.author.send("Du wurdest für den Newsletter angemeldet. Du bekommst gleich eine E-Mail, in der du die Anmeldung bitte einmal kurz bestätigen musst.");
      } catch (e) {
        await msg.author.send(`:x: <@${msg.author.id}> ich konnte dich gerade nicht für den Newsletter registrieren, versuch es bitte später noch einmal.`);
      }
    })
    .catch(() => {
      msg.author.send(":x: du hast leider nur zwei Minuten Zeit deine Email-Adresse einzugeben. Versuche es bitte erneut!");
    });
};

exports.info = {
  name: "newsletter",
  usage: "newsletter",
  help: "Registriere dich für den Pegasusshop Newsletter.",
};
