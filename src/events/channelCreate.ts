/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { DMChannel, GuildChannel } from "discord.js";
import { Event } from "../classes/event";
import { ChannelTypes } from "../utils/ChannelTypes";

export class channelCreateEvent extends Event {
  execute(channel: DMChannel | GuildChannel): void {
    if (!ChannelTypes.has(channel.type)) return;

    this.bot.logger.admin_green(`:inbox_tray: ${ChannelTypes.get(channel.type)}: \`${(channel as GuildChannel).name}\` **wurde erstellt**.`);
  }
}
