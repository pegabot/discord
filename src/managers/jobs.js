/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");
const prettyMs = require("pretty-ms");

exports.Jobs = class {
  constructor(bot) {
    this.bot = bot;
    this.jobs = new Collection();
  }

  get names() {
    return [...this.jobs.keys()];
  }

  get size() {
    return this.jobs.size;
  }

  get(job) {
    return this.jobs.get(job);
  }

  has(job) {
    return this.jobs.has(job);
  }

  delete(job) {
    return this.jobs.delete(job);
  }

  loadJobs() {
    const jobs = fs.readdirSync(path.join(__dirname, "..", "jobs"));
    for (const job of jobs) {
      const name = job.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const module = require(path.join(__dirname, "..", "jobs", name));
      if (module.info.env && process.env[`enable_${module.info.env}`] !== "true") continue;

      this.loadJob(name, module);
    }
  }

  checkJob(name, job) {
    if (this.jobs.has(name)) return `Der Job ${name} existiert bereits.`;
    if (!job.hasOwnProperty("info")) return `Der Job ${name} hat kein Info Objekt.`;
    if (job.run && !job.info.hasOwnProperty("interval")) return `Der Job ${name} muss einen interval Eintrag in seinem Info Objekt besitzen.`;
    return null;
  }

  loadJob(name, module) {
    const error = this.checkJob(name, module);

    if (!error) {
      this.jobs.set(name, module);
      this.executeJob(module);
    } else {
      this.bot.logger.error(error);
    }
  }

  executeJob(module) {
    console.log(`Setup 🔨: ${module.info.name} => ${prettyMs(module.info.interval)}`);
    if (module.setup) module.setup(this.bot);
    if (module.execute) {
      setInterval(() => {
        console.log(`Running ⚙️ : ${module.info.name}`);
        module.execute(this.bot);
      }, module.info.interval);
    }
  }
};
