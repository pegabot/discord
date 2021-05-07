/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { GuildChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";

export default new Event("channelUpdate", (oldChannel, newChannel) => {
  if (oldChannel.type === "dm" || newChannel.type === "dm") return;

  oldChannel.fetch();
  newChannel.fetch();

  let oldGuildChannel: GuildChannel = oldChannel as GuildChannel;
  let newGuildChannel: GuildChannel = newChannel as GuildChannel;

  if (oldGuildChannel.name !== newGuildChannel.name) {
    bot.logger.admin_blue(`Der Kanal \`${oldGuildChannel.name}\` heißt jetzt \`${newGuildChannel.name}\``);
  }

  if (oldGuildChannel.parent !== newGuildChannel.parent) {
    bot.logger.admin_blue(
      `Der Kanal \`${newGuildChannel.name}\` wurde von \`${oldGuildChannel.parent?.name || "keiner Kategorie"}\` zu \`${
        newGuildChannel.parent?.name || "keiner Kategorie"
      }\` verschoben`,
    );
  }
});
