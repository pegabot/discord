/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../core/commands/command";
import { stripIndents } from "../../utils/stripIndents";

export class EventsCommand extends Command {
  name = "events";
  usage = "events";
  help = "Zeigt alle aktivierten Events an";
  owner = true;

  execute(message: Message) {
    const eventNames = this.bot.events.all.keyArray();
    message.channel.send(
      stripIndents(`
    ***Alle aktivierten Events:***
    ${eventNames
      .map((eventName) => "- " + eventName)
      .sort()
      .join("\n")}`),
    );
  }
}
