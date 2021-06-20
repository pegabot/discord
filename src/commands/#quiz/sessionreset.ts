/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../core/commands/command";
import { SessionModel } from "../../models/quiz";
import { CommandExecption } from "../../utils/execptions";
import { resolveMember } from "../../utils/resolveMember";

export class SessionResetCommand extends Command {
  name = "sessionreset";
  usage = "sessionreset <SessionId/ User>";
  help = "Löschen von Sessions.";
  admin = true;

  async execute(msg: Message, args: string[]) {
    if (args.length < 1) throw new CommandExecption("Du musst eine SessionId oder einen Benutzer mit übergeben!");

    let sessions;

    if (msg.mentions.users.size > 0) {
      const user = resolveMember(msg, args.join(" "));

      if (!user) throw new CommandExecption("Benutzer nicht gefunden.");

      sessions = await SessionModel.find({ userId: user.id });
      if (sessions.length < 1) throw new CommandExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);

      for (const session of sessions) {
        msg.channel.send(`Lösche Session ${session._id}`);
        session.remove();
      }
    } else {
      const sessionId = args[0];

      if (!this.bot.db?.Types.ObjectId.isValid(sessionId)) throw new CommandExecption("Die übergebene SessionId ist nicht korrekt.");

      sessions = await SessionModel.find({ _id: sessionId });
      if (sessions.length < 1) throw new CommandExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);

      const session = sessions[0];
      msg.channel.send(`Lösche Session ${session._id}`);
      session.remove();
    }
  }
}
