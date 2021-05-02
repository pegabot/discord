/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";
import { stripIndents } from "../../utils/stripIndents";

export class PingCommand extends Command {
  name = "ping";
  usage = "ping";
  help = "Reaktionszeit des Bots";
  aliases = ["🏓"];
  repeatable = false;

  async execute(msg: Message) {
    const m = await msg.channel.send("Pong!");
    await m.edit(
      stripIndents(
        `Pong!
        Zeit, die in Anspruch genommen wurde: ${m.createdTimestamp - msg.createdTimestamp}ms :timer:
        `,
      ),
    );
  }
}
