/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import { CustomClientEvents } from "../../types/discord.js";
import { Bot } from "../bot";
import { Event } from "./event";

interface EventModule {
  default: Event<never>;
}

export class EventHandler {
  events: Collection<string, Event<never>> = new Collection();
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

  get(event: string): Event<never> | undefined {
    return this.events.get(event);
  }

  has(event: string): boolean {
    return this.events.has(event);
  }

  delete(event: string): boolean {
    return this.events.delete(event);
  }

  private add<K extends keyof CustomClientEvents>(event: Event<K>): void {
    this.bot.client.on(event.name, (...args) => event.listener(...args));
  }

  loadEvents(): void {
    const events = fs.readdirSync(path.join(__dirname, "../..", "events"));
    for (const event of events.filter((file) => !/.*map/.test(file))) {
      const name = event.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      void import(path.join(__dirname, "../..", "events", name)).then((module: EventModule) => {
        this.add(module.default);
        this.events.set(name, module.default);
      });
    }
  }
}
