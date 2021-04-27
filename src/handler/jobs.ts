/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection, MessageEmbed } from "discord.js";
import fs from "fs";
import path from "path";
import prettyMs from "pretty-ms";
import { Bot } from "../classes/bot";
import { Job } from "../classes/job";

export class JobHandler {
  jobs: Collection<string, Job> = new Collection();
  constructor(protected bot: Bot) {}

  get names() {
    return [...this.jobs.keys()];
  }

  get size() {
    return this.jobs.size;
  }

  get all() {
    return this.jobs;
  }

  get(job: string): Job | undefined {
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
      const job: Job = new importedJob[Object.keys(importedJob)[0]](this.bot);

      if (job.env && process.env[`enable_${job.env}`] !== "true") continue;

      this.loadJob(name, job);
    }
  }

  checkJob(name: string) {
    if (this.jobs.has(name)) return `Der Job ${name} existiert bereits.`;
    return null;
  }

  loadJob(name: string, job: Job) {
    const error = this.checkJob(name);

    if (!error) {
      this.jobs.set(name, job);
      this.executeJob(job);
    } else {
      this.bot.logger.error(error);
    }
  }

  async executeJob(job: Job) {
    console.log(`Setup 🔨: ${job.name}${job.interval ? ` => ${prettyMs(job.interval)}` : ""}`);

    if (job.setup) {
      try {
        await job.setup();
      } catch (e) {
        job.disabled = true;
        const embed = new MessageEmbed()
          .setDescription(`<@&${this.bot.config.engineerRole}> Ein Fehler ist aufgetreten beim Setup des Jobs \`${job.name}\``)
          .addField("Fehlermeldung", e.message || "Es ist keine Fehlermeldung vorhanden!");

        this.bot.logger.admin_error_embed(embed);
      }
    }

    if (job.execute) {
      setInterval(async () => {
        if (job.execute && !job.disabled) {
          console.log(`Running ⚙️ : ${job.name}`);

          try {
            await job.execute();
          } catch (e) {
            job.disabled = true;
            const embed = new MessageEmbed()
              .setDescription(`<@&${this.bot.config.engineerRole}> Ein Fehler ist aufgetreten beim Verarbeiten des Jobs \`${job.name}\``)
              .addField("Fehlermeldung", e.message || "Es ist keine Fehlermeldung vorhanden!");

            this.bot.logger.admin_error_embed(embed);
          }
        }
      }, job.interval);
    }
  }
}
