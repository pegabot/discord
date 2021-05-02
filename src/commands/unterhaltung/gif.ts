/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import emojiStrip from "emoji-strip";
import querystring from "querystring";
import { Command } from "../../classes/command";
import { fetchWithTimeout } from "../../utils/fetchWithTimeout";

export class GifCommand extends Command {
  name = "gif";
  usage = ["gif", "gif <text>"];
  help = "Suche nach GIFs mit Hilfer der tenor API.";

  async execute(msg: Message, args: string[]) {
    let text = emojiStrip(msg.cleanContent)
      .replace(/[^a-üA-Ü0-9-_]/g, " ")
      .slice((this.bot?.config?.prefix?.length || 1) + 4)
      .trim()
      .split(" ")
      .filter((elt) => elt !== "");

    if (text.length < 1) text = ["pegasus"];

    try {
      const result: any = await fetchWithTimeout(
        `https://api.tenor.com/v1/search?q=${querystring.escape(text.join(" "))}&key=${this.bot?.config?.TENOR_API_KEY}&limit=1&${new Date().getTime()}`,
      );
      const json = await result.json();
      msg.channel.send(json.results[0].itemurl);
    } catch (e) {
      msg.channel.send(`<@${msg.author.id}> es scheint so, als ob ich gerade keine GIFs von Tenor beziehen kann....`);
    }
  }
}
