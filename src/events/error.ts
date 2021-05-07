/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import bot from "../bot";
import { colors } from "../constants/colors";
import { Event } from "../core/events/event";

export default new Event("error", (error) => {
  const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: \`${JSON.stringify(error.stack)}\``).setColor(colors.red);

  bot.logger.admin_error_embed(embed);
});
