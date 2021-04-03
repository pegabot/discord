/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Collection } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { BotEvent } from "../classes/event";
import { BotType } from "../types/bot";

export class EventHandler {
  events: Collection<string, BotEvent> = new Collection();
  constructor(protected bot: BotType) {}

  get names() {
    return [...this.events.keys()];
  }

  get size() {
    return this.events.size;
  }

  get(event: string): BotEvent | undefined {
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

      const _event: BotEvent = new importedEvent[Object.keys(importedEvent)[0]](this.bot);

      this.bot.on(name, (...args) => _event.execute(...args));
    }
  }
}
