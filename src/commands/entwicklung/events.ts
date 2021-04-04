/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { BotCommand } from "../../classes/command";
import { stripIndents } from "../../utils/stripIndents";

export class EventsCommand extends BotCommand {
  name = "events";
  usage = "events";
  help = "Zeigt alle aktivierten Events an";
  owner = true;

  execute(message: Message): void {
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
