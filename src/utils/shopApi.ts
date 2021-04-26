/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import basic from "basic-authorization-header";
import bent from "bent";
import { Bot } from "../classes/bot";

export const getRequest = async (bot: Bot, url: string): Promise<any> => {
  try {
    const getJSON = bent("json", {
      Authorization: basic(bot.config.PEGASUSSHOP_API_USER, bot.config.PEGASUSSHOP_API_KEY),
    });
    return await getJSON("https://pegasusshop.de/api/" + url);
  } catch (error) {
    console.error(error);
  }
};
