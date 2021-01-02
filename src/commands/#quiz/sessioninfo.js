/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption, resolveUser } = require("../../utils");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "sessioninfo",
  usage: "sessioninfo <SessionId/ User>",
  help: "Informationen zu einer Quiz-Session.",
  admin: true,
  execute: async (bot, msg, args) => {
    if (args.length < 1) throw new BotExecption("Du musst eine SessionId oder einen Benutzer mit übergeben!");

    const SessionModel = bot.db.model("session");

    let sessions;

    if (msg.mentions.users.size > 0) {
      const user = resolveUser(msg, args.join(" "));

      if (!user) throw new BotExecption("Benutzer nicht gefunden.");

      sessions = await SessionModel.find({ userId: user.id });
      if (sessions.length < 1) throw new BotExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);
    } else {
      const sessionId = args[0];

      if (!bot.db.Types.ObjectId.isValid(sessionId)) throw new BotExecption("Die übergebene SessionId ist nicht korrekt.");

      sessions = await SessionModel.find({ _id: sessionId });
      if (sessions.length < 1) throw new BotExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);
    }

    for (const session of sessions) {
      const member = resolveUser(msg, session.userId);

      const embed = new MessageEmbed()
        .setColor(session.status === "error" ? "#f80000" : session.status === "stale" ? "#FF9033" : session.won ? "#7cfc00" : "#1E90FF")
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setTitle(`Informationen zur Session ${session._id}`)
        .addField("Benutzername", member.user.username, true)
        .addField("Zeitstempel", new Date(session.created).toLocaleString("de-DE"), true)
        .addField(`Quizset`, session.quiz ? session.quiz.name : "***Kein Quiz geladen***", true)
        .addField("Status", session.status, true)
        .addField("Gewonnen?", session.won ? "Ja" : "Nein", true)
        .addField("Zeit abgelaufen?", session.timedOut ? "Ja" : "Nein", true)
        .addField("Ausgeliefert?", session.shipped ? "Ja" : "Nein", true);

      msg.channel.send(embed);
    }
  },
};
