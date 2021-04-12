/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import bot from "../../bot";
import { Command } from "../../classes/command";
import { SessionModel } from "../../models/session";
import { BotExecption } from "../../utils/BotExecption";
import { resolveUser } from "../../utils/resolveUser";

export class SessionInfoCommand extends Command {
  name = "sessioninfo";
  usage = "sessioninfo <SessionId/ User>";
  help = "Informationen zu einer Quiz-Session.";
  admin = true;

  async execute(msg: Message, args: string[]): Promise<void> {
    if (args.length < 1) throw new BotExecption("Du musst eine SessionId oder einen Benutzer mit übergeben!");

    let sessions;

    if (msg.mentions.users.size > 0) {
      const user = resolveUser(msg, args.join(" "));

      if (!user) throw new BotExecption("Benutzer nicht gefunden.");

      sessions = await SessionModel.find({ userId: user.id });
      if (sessions.length < 1) throw new BotExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);
    } else {
      const sessionId = args[0];

      if (!this.bot.db?.Types.ObjectId.isValid(sessionId)) throw new BotExecption("Die übergebene SessionId ist nicht korrekt.");

      sessions = await SessionModel.find({ _id: sessionId });
      if (sessions.length < 1) throw new BotExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);
    }

    for (const session of sessions) {
      const member = resolveUser(msg, session.userId);

      const embed = new MessageEmbed()
        .setColor(
          session.status === "error" ? bot.colors.red : session.status === "stale" ? bot.colors.babyblue : session.won ? bot.colors.green : bot.colors.orange,
        )
        .setAuthor(member?.user.tag, member?.user.displayAvatarURL())
        .setTitle(`Informationen zur Session ${session._id}`)
        .addField("Benutzername", member?.user.username, true)
        .addField("Zeitstempel", new Date(session.date).toLocaleString("de-DE"), true)
        .addField(`Quizset`, session.quiz ? session.quiz.name : "***Kein Quiz geladen***", true)
        .addField("Status", session.status, true)
        .addField("Gewonnen?", session.won ? "Ja" : "Nein", true)
        .addField("Zeit abgelaufen?", session.timedOut ? "Ja" : "Nein", true)
        .addField("Ausgeliefert?", session.shipped ? "Ja" : "Nein", true);

      msg.channel.send(embed);
    }
  }
}
