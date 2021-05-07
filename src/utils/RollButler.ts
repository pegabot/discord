/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bent from "bent";
import { MessageEmbed, User } from "discord.js";
import { Bot } from "../core/bot";
import { colors } from "../constants/colors";

export const generateParams = (bot: Bot, user: User, dice: string): URLSearchParams => {
  const params = new URLSearchParams();
  params.append("job", "api");
  params.append("source", "Pegabot");
  params.append("user_id", user.id);
  params.append("usr", user.username);
  params.append("api_key", bot.config.ROLLBUTLER_KEY || "");
  params.append("api_pass", bot.config.ROLLBUTLER_PASS || "");
  params.append("roll", dice);
  params.append("logit", "true");
  params.append("lang", "DE");
  params.append("format", "extended");
  return params;
};

export const rollDice = (bot: Bot, params: URLSearchParams): Promise<string> => {
  const handler = bent(`https://rollbutler.net/index.php?`, "string", {
    HttpMethod: "GET",
    Headers: {
      Authorization: `BOT ${bot.config.ROLLBUTLER_KEY}`,
      Accept: "application/json",
      "User-Agent": "Pegabot",
      "Content-Type": "application/json",
    },
  });

  return handler(`${params.toString()}`);
};

export const generateEmbed = (bot: Bot, dice: string, user: User, response: any): MessageEmbed => {
  const embed = new MessageEmbed();
  embed.setColor(colors.babyblue);
  embed.setTitle(`Ergebnis für ${dice}`);
  embed.setDescription(`${user}, ${response.message.charAt(0).toLowerCase() + response.message.slice(1)}`);
  embed.setFooter("powered by RollButler");
  return embed;
};
