/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Job } from "../core/jobs/job";
import { SessionModel } from "../models/quiz";
import { stripIndents } from "../utils/stripIndents";

export class ResetSessionJob extends Job {
  name = "Session zurücksetzen";
  env = "sessionreset";
  interval = 20000;

  setup(): void {
    SessionModel.find({ status: "in progress" }, (error, sessions) => {
      if (sessions.length === 0) return;

      this.bot.logger.console(`Setting stale status to ${sessions.length} session(s)!`);
      for (const session of sessions) {
        session.status = "stale";
        session.save();
      }
    });
  }

  execute(): void {
    SessionModel.find({ status: "in progress", expires: { $lt: Date.now() } }, (error, sessions) => {
      if (sessions.length === 0) return;

      for (const session of sessions) {
        this.bot.client.users.cache.get(session.userId || "")?.send(
          stripIndents(`
          Du hast dein Spiel leider nicht in der vorgegebenen Zeit zu Ende gespielt und somit die Chance auf den Gewinn verpasst.
          
          Dein Pegabot :robot:
          `),
        );

        session.status = "closed";
        session.timedOut = true;

        session.save();
      }
    });
  }
}
