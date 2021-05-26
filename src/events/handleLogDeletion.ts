/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";
import { LogMessagePrefix } from "../utils/redis";

export default new Event("handleLogDeletion", (reaction, user) => {
  bot.redis.client.get(`${LogMessagePrefix}${reaction.message.id}`, async (error, logKey) => {
    if (error) throw error;
    if (!logKey) return;

    bot.redis.client.del(`${LogMessagePrefix}${reaction.message.id}`);
    bot.redis.client.del(logKey);

    try {
      const message = await (reaction.message.channel as TextChannel).messages.fetch(reaction.message.id as string);
      message.delete();
    } catch (error) {
      return;
    }
  });
});
