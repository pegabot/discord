/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import bent from "bent";
import { BotType } from "../types/bot";

const basic = require("basic-authorization-header");

export const getRequest = async (bot: BotType, url: string): Promise<any> => {
  try {
    const getJSON = bent("json", {
      Authorization: basic(bot.config?.PEGASUSSHOP_API_USER, bot.config?.PEGASUSSHOP_API_KEY),
    });
    return await getJSON("https://pegasusshop.de/api/" + url);
  } catch (error) {
    console.error(error);
  }
};
