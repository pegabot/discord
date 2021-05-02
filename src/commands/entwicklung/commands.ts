/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { stripIndents } from "../../utils/stripIndents";

export class CommandsCommand extends Command {
  name = "commands";
  usage = "commands";
  help = "Zeigt alle aktivierten Commands an";
  owner = true;

  execute(message: Message) {
    const commands = this.bot.commands.all.array();
    message.channel.send(
      stripIndents(`
    ***Alle aktivierten Commands:***
    ${commands
      .map((command) => "- " + command.name)
      .sort()
      .join("\n")}`),
    );
  }
}
