/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption, resolveUser } = require("../../utils");
const { MessageEmbed } = require("discord.js");

exports.run = async (bot, msg, args) => {
  if (args.length < 1) {
    const SessionModel = bot.db.model("session");
    const sessions = await SessionModel.find({});

    if (sessions.length < 1) throw new BotExecption("Es wurden keine Sessions gefunden!");

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(`Informationen zu Sessions`)
      .addFields(
        { name: "Gesamt", value: sessions.length, inline: true },
        { name: "Offen", value: sessions.filter((elt) => elt.status === "in progress").length, inline: true },
        { name: "Geschlossen", value: sessions.filter((elt) => elt.status === "closed").length, inline: true },
        { name: "Fehler 🚨", value: sessions.filter((elt) => elt.status === "error").length, inline: true },
        { name: "Gewonnen 🏆", value: sessions.filter((elt) => elt.won).length, inline: true },
        { name: "Verloren 😑", value: sessions.filter((elt) => !elt.won && elt.status === "closed").length, inline: true },
      )
      .setTimestamp();

    msg.channel.send(embed);
  } else {
    const SessionModel = bot.db.model("session");

    if (msg.mentions.users.size > 0) {
      const user = resolveUser(msg, args.join(" "));

      if (!user) throw new BotExecption("Benutzer nicht gefunden.");

      const sessions = await SessionModel.find({ userId: user.id });
      if (sessions.length < 1) throw new BotExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);
    } else {
      const sessionId = args[0];

      if (!bot.db.Types.ObjectId.isValid(sessionId)) throw new BotExecption("Die übergebene SessionId ist nicht korrekt.");

      const sessions = await SessionModel.find({ _id: sessionId });
      if (sessions.length < 1) throw new BotExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);
    }

    for (const session of sessions) {
      const member = resolveUser(msg, session.userId);

      const embed = new MessageEmbed()
        .setColor(session.status === "error" ? "#f80000" : session.won ? "#7cfc00" : "#FF9033")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`Informationen zur Session ${session._id}`)
        .addField("Benutzername", member.user.username, true)
        .addField("Zeitstempel", new Date(session.created).toLocaleString("de-DE"), true)
        .addField(`Quizset`, session.quiz.name, true)
        .addField("Status", session.status, true)
        .addField("Gewonnen?", session.won ? "Ja" : "Nein", true)
        .addField("Ausgeliefert?", session.shipped ? "Ja" : "Nein", true);

      msg.channel.send(embed);
    }
  }
};

exports.info = {
  name: "sessioninfo",
  usage: "sessioninfo <SessionId/ User>",
  help: "Informationen zu einer Quiz-Session.",
  admin: true,
};
