/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { Bot } from "../classes/bot";
import { Event } from "../classes/event";

export class EventHandler {
  events: Collection<string, Event> = new Collection();
  constructor(protected bot: Bot) {}

  get names() {
    return [...this.events.keys()];
  }

  get size() {
    return this.events.size;
  }

  get all() {
    return this.events;
  }

  get(event: string): Event | undefined {
    return this.events.get(event);
  }

  has(event: string): boolean {
    return this.events.has(event);
  }

  delete(event: string): boolean {
    return this.events.delete(event);
  }

  loadEvents(): void {
    const events = fs.readdirSync(path.join(__dirname, "..", "events"));
    for (const event of events) {
      const name = event.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const importedEvent = require(path.join(__dirname, "..", "events", name));
      this.events.set(name, importedEvent);

      const _event: Event = new importedEvent[Object.keys(importedEvent)[0]](this.bot);

      this.bot.client.on(name, (...args) => _event.execute(...args));
    }
  }
}
