/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { DMChannel, GuildChannel } from "discord.js";
import { BotEvent } from "../classes/event";
import { ChannelTypes } from "../utils/ChannelTypes";

export class channelDeleteEvent extends BotEvent {
  execute(channel: DMChannel | GuildChannel): void {
    if (typeof channel === typeof DMChannel) return;

    this.bot.logger?.admin_red(`:inbox_tray: ${ChannelTypes.get(channel.type)}: \`${(channel as GuildChannel).name}\` **wurde gelöscht**.`);
  }
}
