/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Task } from "../core/tasks/task";
import { LevelModel } from "../models/levels";

export class LevelAddUserTask extends Task {
  name = "Füge Mitglieder zu Level Dokumenten hinzu";
  interval = 60000;

  execute(): void {
    LevelModel.find({ user: { $exists: false } }, (error, entries) => {
      if (error) throw error;
      entries.forEach(async (entry) => {
        const user = await this.bot.client.users.fetch(entry.userID);
        if (!user) return;
        entry.user = JSON.parse(JSON.stringify(user));
        entry.save();
      });
    });
  }
}
