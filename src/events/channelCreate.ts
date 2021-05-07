/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { GuildChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../classes/event";
import { ChannelTypes } from "../utils/channelTypes";

export default new Event("channelCreate", (channel) => {
  if (!ChannelTypes.has(channel.type)) return;

  bot.logger.admin_green(`:inbox_tray: ${ChannelTypes.get(channel.type)}: \`${(channel as GuildChannel).name}\` **wurde erstellt**.`);
});
