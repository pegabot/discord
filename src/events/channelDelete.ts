/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { DMChannel, GuildChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../classes/event";
import { ChannelTypes } from "../utils/channelTypes";

export default new Event("channelDelete", (channel) => {
  if (typeof channel === typeof DMChannel) return;

  bot.logger.admin_red(`:inbox_tray: ${ChannelTypes.get(channel.type)}: \`${(channel as GuildChannel).name}\` **wurde gelöscht**.`);
});
