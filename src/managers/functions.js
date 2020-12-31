/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

exports.Functions = class {
  constructor(bot) {
    this.bot = bot;
    this.functions = new Collection();
  }

  get names() {
    return [...this.functions.keys()];
  }

  get size() {
    return this.functions.size;
  }

  get(func) {
    return this.functions.get(func);
  }

  has(func) {
    return this.functions.has(func);
  }

  delete(func) {
    return this.functions.delete(func);
  }

  loadFunctions() {
    const funcs = fs.readdirSync(path.join(__dirname, "..", "functions"));
    for (const func of funcs) {
      const name = func.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const module = require(path.join(__dirname, "..", "functions", name));
      if (module.info.env && process.env[`enable_${module.info.env}`] !== "true") continue;

      this.loadCommand(name, module);
    }
  }

  checkCommand(name, func) {
    if (this.functions.has(name)) return `Die Function ${name} existiert bereits.`;
    if (!func.hasOwnProperty("info")) return `Die Function ${name} hat kein Info Objekt.`;
    if (func.run && !func.info.hasOwnProperty("interval")) return `Die Function ${name} muss einen interval Eintrag in seinem Info Objekt besitzen.`;
    return null;
  }

  loadCommand(name, module) {
    const error = this.checkCommand(name, module);

    if (!error) {
      this.functions.set(name, module);
      this.runFunction(module);
    } else {
      this.bot.logger.error(error);
    }
  }

  runFunction(module) {
    console.log(`Setup 🔨: ${module.info.name}`);
    if (module.setup) module.setup(this.bot);
    if (module.run) {
      setInterval(() => {
        if (process.env.NODE_ENV !== "production") console.log(`Running ⚙️ : ${module.info.name}`);
        module.run(this.bot);
      }, module.info.interval);
    }
  }
};
