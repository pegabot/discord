/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { SessionModel } from "../../models/session";
import { BotExecption } from "../../utils/BotExecption";
import { resolveUser } from "../../utils/resolveUser";

export class SessionResetCommand extends Command {
  name = "sessionreset";
  usage = "sessionreset <SessionId/ User>";
  help = "Löschen von Sessions.";
  admin = true;

  async execute(msg: Message, args: string[]): Promise<void> {
    if (args.length < 1) throw new BotExecption("Du musst eine SessionId oder einen Benutzer mit übergeben!");

    let sessions;

    if (msg.mentions.users.size > 0) {
      const user = resolveUser(msg, args.join(" "));

      if (!user) throw new BotExecption("Benutzer nicht gefunden.");

      sessions = await SessionModel.find({ userId: user.id });
      if (sessions.length < 1) throw new BotExecption(`Es wurde keine Session für den User <@${user.id}> gefunden.`);

      for (const session of sessions) {
        msg.channel.send(`Lösche Session ${session._id}`);
        session.remove();
      }
    } else {
      const sessionId = args[0];

      if (!this.bot.db?.Types.ObjectId.isValid(sessionId)) throw new BotExecption("Die übergebene SessionId ist nicht korrekt.");

      sessions = await SessionModel.find({ _id: sessionId });
      if (sessions.length < 1) throw new BotExecption(`Die Session mit der Id ${sessionId} existiert nicht.`);

      const session = sessions[0];
      msg.channel.send(`Lösche Session ${session._id}`);
      session.remove();
    }
  }
}
