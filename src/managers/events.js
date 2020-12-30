/*
 * Copyright (c) 2020 - 2021 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

exports.Events = class {
  constructor(bot) {
    this.bot = bot;
    this.events = new Collection();
  }

  get names() {
    return [...this.events.keys()];
  }

  get size() {
    return this.events.size;
  }

  get(event) {
    return this.events.get(event);
  }

  has(event) {
    return this.events.has(event);
  }

  delete(event) {
    return this.events.delete(event);
  }

  loadEvents() {
    const events = fs.readdirSync(path.join(__dirname, "..", "events"));
    for (const event of events) {
      const name = event.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const module = require(path.join(__dirname, "..", "events", name));
      if (module.disable) continue;

      this.events.set(name, module);

      this.bot.on(name, (...args) => module.run(this.bot, ...args));
    }
  }
};
