/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { BotJob } from "../classes/job";
import { LevelModel } from "../models/levels";

export class LevelAddUserJob extends BotJob {
  name = "Füge Mitglieder zu Level Dokumenten hinzu";
  interval = 60000;

  async execute(): Promise<void> {
    LevelModel.find({ user: { $exists: false } }, (error, entries) => {
      if (error) return;
      entries.forEach(async (entry) => {
        const user = await this.bot.users.fetch(entry.userID);
        entry.user = JSON.parse(JSON.stringify(user));
        entry.save();
      });
    });
  }
}
