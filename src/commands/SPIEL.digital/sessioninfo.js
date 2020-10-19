/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const { BotExecption, resolveUser } = require("../../utils");
const { MessageEmbed } = require("discord.js");

exports.run = async (bot, msg, args) => {
  if (args.length < 1) throw new BotExecption("Du musst eine SessionId mit übergeben.");

  const sessionId = args[0];

  if (!bot.db.Types.ObjectId.isValid(sessionId)) throw new BotExecption("Die übergebene SessionId ist nicht korrekt.");

  const SessionModel = bot.db.model("session");
  const sessions = await SessionModel.find({ _id: sessionId });
  if (sessions.length < 1) throw new BotExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);

  const session = sessions[0];

  const member = resolveUser(msg, session.userId);

  const embed = new MessageEmbed()
    .setColor(session.status === "error" ? "#f80000" : session.won ? "#7cfc00" : "#FF9033")
    .setAuthor(member.user.tag, member.user.displayAvatarURL())
    .setTitle(`Informationen zur Session ${sessionId}`)
    .addField("Benutzername", member.user.username, true)
    .addField("Zeitstempel", new Date(session.created).toLocaleString("de-DE"), true)
    .addField(`Quizset`, session.quiz.name, true)
    .addField("Status", session.status, true)
    .addField("Gewonnen?", session.won ? "Ja" : "Nein", true)
    .addField("Ausgeliefert?", session.shipped ? "Ja" : "Nein", true);

  msg.channel.send(embed);
};

exports.info = {
  name: "sessioninfo",
  usage: "sessioninfo <SessionId>",
  help: "Informationen zu einer Quiz-Session.",
  admin: true,
};
