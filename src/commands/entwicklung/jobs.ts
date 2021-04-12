/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { stripIndents } from "../../utils/stripIndents";

export class JobsCommand extends Command {
  name = "jobs";
  usage = "jobs";
  help = "Zeigt alle aktivierten Jobs an";
  owner = true;

  execute(message: Message): void {
    const jobs = this.bot.jobs.all.array();
    message.channel.send(
      stripIndents(`
    ***Alle aktivierten Jobs:***
    ${jobs
      .map((job) => "- " + job.name)
      .sort()
      .join("\n")}`),
    );
  }
}
