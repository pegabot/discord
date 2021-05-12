/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import bot from "../bot";
import { colors } from "../constants/colors";
import { Event } from "../core/events/event";
import { isProduction } from "../utils/environment";

export default new Event("error", (error) => {
  if (!isProduction()) console.log(error);
  const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: \`${JSON.stringify(error.message)}\``).setColor(colors.red);

  bot.logger.admin_error_embed(embed);
});
