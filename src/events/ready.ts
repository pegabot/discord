/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { BotEvent } from "../classes/event";
import { setDefault } from "../utils/presence";

export class ReadyEvent extends BotEvent {
  execute() {
    this.bot.commands?.loadCommands();
    // this.bot.jobs.loadJobs();

    const message = `${this.bot.user?.username}#${this.bot.user?.discriminator} ist ready!
      -------------------------------
        ID: ${this.bot.user?.id}
        Aktuell in ${this.bot.guilds.cache.size} Guilde(n)
        ${this.bot.commands?.size} Command(s) geladen 🤖,
        ${this.bot.MongoConnector?.size} Models(s) geladen 🧭
        ${this.bot.events?.size} Event(s) geladen 🎟`;

    this.bot.logger?.info(message);
    if (process.env.NODE_ENV === "production") this.bot.logger?.admin(message);
    setDefault(this.bot);
  }
}
