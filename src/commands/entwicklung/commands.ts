/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { BotCommand } from "../../classes/command";
import { stripIndents } from "../../utils/stripIndents";

export class CommandsCommand extends BotCommand {
  name = "commands";
  usage = "commands";
  help = "Zeigt alle aktivierten Commands an";
  owner = true;

  execute(message: Message): void {
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
