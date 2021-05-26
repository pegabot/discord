/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import bot from "../bot";
import { Bot } from "../core/bot";
import { Event } from "../core/events/event";
import { setDefault, setStreaming } from "../utils/presence";
import { checkIfStreaming } from "../utils/twitch";

const redisKey = "currentStreamer";

let isHosting = false;
let isStreaming = false;

const sendNotification = (bot: Bot, name: string) => {
  bot.redis.client.get(redisKey, (error, value) => {
    if (error) throw error;

    if (value === name) return;
    bot.redis.client.set(redisKey, name);

    const guild = bot.client.guilds.cache.get(bot.config.guildId || "");
    const channel = guild?.channels.cache.get(bot.config.TWITCH_INFO_CHANNEL || "");
    (channel as TextChannel).send(`📣 ***${name}*** ist eben auf Twitch live gegangen 🍾 \n https://twitch.tv/${name}`);
  });
};

const removeKey = () => {
  bot.redis.client.del(redisKey);
};

export default new Event("handleTwitch", async (HosttargetMessage) => {
  if (HosttargetMessage) {
    if (HosttargetMessage.wasHostModeEntered()) {
      if (isHosting) return;
      if (bot.config.TWITCH_INFO_CHANNEL) {
        sendNotification(bot, HosttargetMessage.hostedChannelName);
      }
      return setStreaming(bot, HosttargetMessage.hostedChannelName);
    }

    if (HosttargetMessage.wasHostModeExited()) {
      isHosting = false;
      setDefault(bot);
      removeKey();
    }
  }

  if (isHosting) return;

  if (await checkIfStreaming("176169616")) {
    if (isStreaming) return;
    isStreaming = true;
    if (bot.config.TWITCH_INFO_CHANNEL) {
      sendNotification(bot, HosttargetMessage?.hostedChannelName || "");
    }
    return setStreaming(bot, "pegasusspiele", "Pegasus");
  } else {
    if (!isStreaming) return;
    isStreaming = false;
    setDefault(bot);
    removeKey();
  }
});
