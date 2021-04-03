/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Bot } from "../classes/bot";

export const setDefault = (bot: Bot): void => {
  bot.client.user?.setActivity(`${bot.config.prefix}help`, { type: "LISTENING" });
};

export const setStreaming = (bot: Bot, streamer: string, name?: string) => {
  bot.client.user?.setActivity(`${name || streamer} auf Twitch!`, {
    type: "STREAMING",
    url: `https://www.twitch.tv/${streamer}`,
  });
};
