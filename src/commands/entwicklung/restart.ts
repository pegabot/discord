/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Command } from "../../classes/command";

export class RestartCommand extends Command {
  name = "restart";
  usage = "restart";
  help = "Neustart des Bots";
  owner = true;
  disabled = true;

  async execute(msg: Message) {
    await msg.channel.send(`Starte neu 🍹`);
    this.bot.destroy();
    process.exit(0);
  }
}
