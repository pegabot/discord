/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  crypto: { computeSHA256 },
  fetchWithTimeout,
} = require("./../../utils");
const { format } = require("date-fns");

module.exports = {
  name: "newsletter",
  usage: "newsletter",
  help: "Registriere dich für den Pegasusshop Newsletter.",
  execute: async (bot, msg) => {
    const collectorMessage = await msg.author.send("Wie lautet deine Email-Adresse?");

    const filter = (response) => /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(response);

    collectorMessage.channel
      .awaitMessages(filter, { max: 1, time: 120000, errors: ["time"] })
      .then(async (collected) => {
        const email = collected.first().content;

        const hash = computeSHA256(format(new Date(), "ddMMyyyy") + email + process.env.NEWSLETTER_SECRET);

        try {
          const resp = await fetchWithTimeout(
            `https://pegasusshop.de/saveNewNewsletter/subscribeToNewsletter?&newsletter=${email}&subscribeToNewsletter=1&newslettergroup=1&crypt=${hash}`,
          );
          if (resp.status !== 200) throw new Error();
          await msg.author.send(
            "Du wurdest für den Newsletter angemeldet. Du bekommst gleich eine E-Mail, in der du die Anmeldung bitte einmal kurz bestätigen musst.",
          );
        } catch (e) {
          await msg.author.send(`:x: <@${msg.author.id}> ich konnte dich gerade nicht für den Newsletter registrieren, versuch es bitte später noch einmal.`);
        }
      })
      .catch(() => {
        msg.author.send(":x: du hast leider nur zwei Minuten Zeit deine Email-Adresse einzugeben. Versuche es bitte erneut!");
      });
  },
};
