/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import prettyMs from "pretty-ms";
import bot from "../bot";

export const getUptime = (): string => {
  return prettyMs(bot.client.uptime || -1);
};
