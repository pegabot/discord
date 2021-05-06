/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Event } from "../classes/event";
import { version } from "../constants/version";
import { isProduction } from "../utils/environment";
import { setDefault } from "../utils/presence";
import { getSystemStatus } from "../utils/status";

export class ReadyEvent extends Event {
  execute() {
    this.bot.commands.loadCommands();
    this.bot.jobs.loadJobs();

    const message = `${this.bot.client.user?.username}#${this.bot.client.user?.discriminator} ist ready!
      -------------------------------
        Version: ${version}
        ID: ${this.bot.client.user?.id}
        Aktuell in ${this.bot.client.guilds.cache.size} Guilde(n)
        ${this.bot.commands.size} Command(s) geladen 🤖
        ${this.bot.MongoConnector?.size} Models(s) geladen 🧭
        ${this.bot.events?.size} Event(s) geladen 🎟
        ${this.bot.jobs?.size} Job(s) aktiviert ⚙️`;

    this.bot.logger.console(message);
    if (isProduction()) {
      this.bot.logger.admin(message);
      this.bot.logger.admin(getSystemStatus());
    }
    setDefault(this.bot);
  }
}
