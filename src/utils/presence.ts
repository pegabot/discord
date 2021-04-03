/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { BotType } from "../types/bot";

export const setDefault = (bot: BotType): void => {
  bot.user?.setActivity(`${bot.config?.prefix}help`, { type: "LISTENING" });
};

export const setStreaming = (bot: BotType, streamer: string, name?: string) => {
  bot.user?.setActivity(`${name || streamer} auf Twitch!`, {
    type: "STREAMING",
    url: `https://www.twitch.tv/${streamer}`,
  });
};
