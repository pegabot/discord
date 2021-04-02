/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { BotEvent } from "../classes/event";
import { ChannelTypes } from "../utils/ChannelTypes";
const { Channel } = require("discord.js");

export class channelDeleteEvent extends BotEvent {
  execute(channel: typeof Channel): void {
    if (channel.partial) return;

    this.bot.logger?.admin_red(`:inbox_tray: ${ChannelTypes.get(channel.type)}: \`${channel.name}\` **wurde gelöscht**.`);
  }
}
