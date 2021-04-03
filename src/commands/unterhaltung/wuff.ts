/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message, MessageAttachment } from "discord.js";
import { BotCommand } from "../../classes/command";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout";

export class WuffCommand extends BotCommand {
  name = "wuff";
  usage = ["wuff"];
  help = "Liefert ein zufälliges Hundebild zurück.";
  channel = ["718145438339039325"];

  async execute(msg: Message): Promise<void> {
    try {
      const responseJson: any = await fetchWithTimeout(`https://dog.ceo/api/breeds/image/random`);
      const json = await responseJson.json();
      const response: any = await fetchWithTimeout(json.message, {});
      const buffer = await response.buffer();
      msg.channel.send("", new MessageAttachment(buffer));
    } catch (e) {
      msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Hundebilder für dich laden kann 🐶`);
    }
  }
}
