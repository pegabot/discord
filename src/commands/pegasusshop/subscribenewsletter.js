/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption } = require("../../utils");
const md5 = require("md5");
const { format } = require("date-fns");
const { fetchWithTimeout } = require("./../../utils");

exports.run = async (bot, msg, args) => {
  if (args.length < 1) throw new BotExecption("Du musst eine Email-Adresse mit übergeben!");

  const regex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  if (!regex.test(args[0])) throw new BotExecption("Die übergebene Email ist nicht valide!");

  const hash = md5(format(new Date(), "ddMMyyyy") + args[0] + process.env.NEWSLETTER_SECRET);

  try {
    await fetchWithTimeout(`https://pegasusshop.de/saveNewNewsletter/subscribeToNewsletter?&newsletter=${args[0]}&subscribeToNewsletter=1&newslettergroup=1&crypt=${hash}.`);
    msg.channel.send("Du wurdest für den Newsletter angemeldet. Du bekommst gleich eine E-Mail, in der du die Anmeldung bitte einmal kurz bestätigen musst.");
  } catch (e) {
    msg.channel.send(`<@${msg.author.id}> ich konnte dich gerade nicht für den Newsletter registrieren, versuch es bitte später noch einmal.`);
  }
};

exports.info = {
  name: "subscribenewsletter",
  usage: "subscribenewsletter <email-adresse>",
  help: "Registriere dich für den Pegasusshop Newsletter.",
};
