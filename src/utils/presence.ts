/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Bot } from "../core/bot";

export const setDefault = (bot: Bot): void => {
  bot.client.user?.setActivity(`pegasus.de/youtube`, { type: "WATCHING" });
};

export const setStreaming = (bot: Bot, streamer: string, name?: string) => {
  bot.client.user?.setActivity(`${name || streamer} auf Twitch!`, {
    type: "STREAMING",
    url: `https://www.twitch.tv/${streamer}`,
  });
};
