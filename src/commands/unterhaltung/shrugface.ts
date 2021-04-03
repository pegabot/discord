/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { BotCommand } from "../../classes/command";

export class ShrugfaceCommand extends BotCommand {
  name = "shrugface";
  aliases = ["shrug"];
  usage = ["shrugface"];
  help = "Es gibt nur ein Shrugface.";

  execute(msg: Message): void {
    msg.delete();
    msg.channel.send("¯\\_(ツ)_/¯");
  }
}
