/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message, MessageAttachment } from "discord.js";
import emojiStrip from "emoji-strip";
import querystring from "querystring";
import { Command } from "../../classes/command";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout";

export class MiauCommand extends Command {
  name = "miau";
  usage = ["miau", "miau <text>"];
  help = "Liefert ein zufälliges Katzenbild zurück.";
  channel = ["718145438339039325", "697111104874348585", "815903133707272213", "801788525099352122"];

  async execute(msg: Message, args: string[]) {
    let text = emojiStrip(msg.cleanContent)
      .replace(/[^a-üA-Ü0-9-_]/g, " ")
      .slice((this.bot?.config?.prefix?.length || 1) + 4)
      .trim()
      .split(" ")
      .filter((elt) => elt !== "");

    if (text.length < 1) text = ["miau"];

    try {
      const result: any = await fetchWithTimeout(
        `https://cataas.com/cat/says/${querystring.escape(text.join(" "))}?${new Date().getTime()}&size=50&color=white&type=large`,
      );
      const buffer = await result.buffer();
      msg.channel.send("", new MessageAttachment(buffer));
    } catch (e) {
      msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine Katzenbilder für dich laden kann 😿`);
    }
  }
}
