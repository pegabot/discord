/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Collection } from "discord.js";
import { BotJob } from "../classes/job";
import { BotType } from "../types/bot";

import fs from "fs";
import path from "path";
import prettyMs from "pretty-ms";

export class JobHandler {
  jobs: Collection<string, BotJob> = new Collection();
  constructor(protected bot: BotType) {}

  get names() {
    return [...this.jobs.keys()];
  }

  get size() {
    return this.jobs.size;
  }

  get(job: string): BotJob | undefined {
    return this.jobs.get(job);
  }

  has(job: string): boolean {
    return this.jobs.has(job);
  }

  delete(job: string): boolean {
    return this.jobs.delete(job);
  }

  loadJobs() {
    const jobs = fs.readdirSync(path.join(__dirname, "..", "jobs"));
    for (const _job of jobs) {
      const name = _job.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const importedJob = require(path.join(__dirname, "..", "jobs", name));
      const job: BotJob = new importedJob[Object.keys(importedJob)[0]](this.bot);

      if (job.env && process.env[`enable_${job.env}`] !== "true") continue;

      this.loadJob(name, job);
    }
  }

  checkJob(name: string) {
    if (this.jobs.has(name)) return `Der Job ${name} existiert bereits.`;
    return null;
  }

  loadJob(name: string, job: BotJob) {
    const error = this.checkJob(name);

    if (!error) {
      this.jobs.set(name, job);
      this.executeJob(job);
    } else {
      this.bot.logger?.error(error);
    }
  }

  executeJob(job: BotJob) {
    console.log(`Setup 🔨: ${job.name}${job.interval ? ` => ${prettyMs(job.interval)}` : ""}`);

    if (job.setup) job.setup();

    if (job.execute) {
      setInterval(() => {
        console.log(`Running ⚙️ : ${job.name}`);
        if (job.execute) job.execute();
      }, job.interval);
    }
  }
}
