/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CategoryChannel, Message, TextChannel } from "discord.js";
import { Command } from "../../classes/command";

export class ChannelDeleteCommand extends Command {
  name = "channelDelete";
  usage = ["channelDelete"];
  help = "Lösche die Känale zur zugehörigen Kategorie und die Kategorie.";
  permissions = ["MANAGE_CHANNELS"];

  execute(msg: Message): void {
    const { id: channelID, parentID } = msg.channel as TextChannel;

    if (
      this.bot?.config &&
      Object.keys(this.bot?.config)
        .filter((elt) => elt.toLowerCase().match(/.*channel.*/))
        .map((elt) => (this.bot?.config as NodeJS.ProcessEnv)[elt])
        .filter((elt) => elt !== "" && !isNaN(Number(elt)))
        .includes(channelID)
    )
      return;

    if (!parentID) {
      msg.channel.delete();
      return;
    } else {
      const category = msg?.guild?.channels.cache.find((elt) => elt.id === parentID);
      if (!category) return;

      const { children } = category as CategoryChannel;
      for (const child of children) {
        child[1].delete();
      }
      category.delete();
    }
  }
}
