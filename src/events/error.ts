/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import { Event } from "../classes/event";
import { colors } from "../constants/colors";

export class errorEvent extends Event {
  execute(error: Error): void {
    const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: \`${JSON.stringify(error.stack)}\``).setColor(colors.red);

    this.bot.logger.admin_error_embed(embed);
  }
}
