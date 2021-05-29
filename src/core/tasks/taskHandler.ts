/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Collection } from "discord.js";
import fs from "fs";
import path from "path";
import prettyMs from "pretty-ms";
import { BaseExecption } from "../../utils/execptions";
import { Bot } from "../bot";
import { Task } from "./task";

export class TaskHandler {
  tasks: Collection<string, Task> = new Collection();
  constructor(protected bot: Bot) {}

  get names() {
    return [...this.tasks.keys()];
  }

  get size() {
    return this.tasks.size;
  }

  get all() {
    return this.tasks;
  }

  get(task: string): Task | undefined {
    return this.tasks.get(task);
  }

  has(task: string): boolean {
    return this.tasks.has(task);
  }

  delete(task: string): boolean {
    return this.tasks.delete(task);
  }

  loadTasks() {
    const tasks = fs.readdirSync(path.join(__dirname, "../..", "tasks"));
    for (const _task of tasks.filter((file) => !/.*map/.test(file))) {
      const name = _task.split(".")[0];
      if (/\w?#.+/.test(name)) continue;

      const importedTask = require(path.join(__dirname, "../..", "tasks", name));
      const task: Task = new importedTask[Object.keys(importedTask)[0]](this.bot);

      if (task.env && process.env[`enable_${task.env}`] !== "true") continue;

      this.loadTask(name, task);
    }
  }

  private checkTask(name: string) {
    if (this.tasks.has(name)) return `Der Task ${name} existiert bereits.`;
    return null;
  }

  private loadTask(name: string, task: Task) {
    const error = this.checkTask(name);

    if (!error) {
      this.tasks.set(name, task);
      this.executeTask(task);
    } else {
      this.bot.logger.error(error);
    }
  }

  private handleExecption(error: BaseExecption, task: Task): void {
    this.bot.logger.admin_error(error, `Ein Fehler ist aufgetreten beim Verarbeiten des Tasks ${task.name}`);

    if (!error.ignore) {
      task.stopped = true;
    }
  }

  async executeTask(task: Task) {
    console.log(`Setup 🔨: ${task.name}${task.interval ? ` => ${prettyMs(task.interval)}` : ""}`);

    if (task.setup) {
      try {
        await task.setup();
      } catch (e) {
        this.handleExecption(e, task);
      }
    }

    if (task.execute) {
      setInterval(async () => {
        if (task.execute && !task.stopped) {
          console.log(`Running ⚙️ : ${task.name}`);

          try {
            await task.execute();
          } catch (e) {
            this.handleExecption(e, task);
          }
        }
      }, task.interval);
    }
  }
}
