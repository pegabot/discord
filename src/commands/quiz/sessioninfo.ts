/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageEmbed } from "discord.js";
import { Command } from "../../classes/command";
import { colors } from "../../constants/colors";
import { SessionModel } from "../../models/session";
import { CommandExecption } from "../../utils/execptions";
import { resolveUser } from "../../utils/resolveUser";

export class SessionInfoCommand extends Command {
  name = "sessioninfo";
  usage = "sessioninfo <SessionId/ User>";
  help = "Informationen zu einer Quiz-Session.";
  admin = true;

  async execute(msg: Message, args: string[]) {
    if (args.length < 1) throw new CommandExecption("Du musst eine SessionId oder einen Benutzer mit übergeben!");

    let sessions;

    if (msg.mentions.users.size > 0) {
      const user = resolveUser(msg, args.join(" "));

      if (!user) throw new CommandExecption("Benutzer nicht gefunden.");

      sessions = await SessionModel.find({ userId: user.id });
      if (sessions.length < 1) throw new CommandExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);
    } else {
      const sessionId = args[0];

      if (!this.bot.db?.Types.ObjectId.isValid(sessionId)) throw new CommandExecption("Die übergebene SessionId ist nicht korrekt.");

      sessions = await SessionModel.find({ _id: sessionId });
      if (sessions.length < 1) throw new CommandExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);
    }

    for (const session of sessions) {
      const member = resolveUser(msg, session.userId);

      const embed = new MessageEmbed()
        .setColor(session.status === "error" ? colors.red : session.status === "stale" ? colors.babyblue : session.won ? colors.green : colors.orange)
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
