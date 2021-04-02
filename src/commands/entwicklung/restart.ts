/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Command } from "../../classes/command";
import { Message } from "discord.js";

export class RestartCommand extends Command {
  name = "restart";
  usage = "restart";
  help = "Neustart des Bots";
  owner = true;
  disabled = true;

  async execute(msg: Message) {
    await msg.channel.send(`Starte neu 🍹`);
    process.exit(0);
  }
}
