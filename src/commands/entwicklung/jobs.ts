/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../core/commands/command";
import { stripIndents } from "../../utils/stripIndents";

export class JobsCommand extends Command {
  name = "jobs";
  usage = "jobs";
  help = "Zeigt alle aktivierten Jobs an";
  owner = true;

  execute(message: Message) {
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
