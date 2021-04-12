/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import { Event } from "../classes/event";

export class errorEvent extends Event {
  execute(error: Error): void {
    const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: \`${JSON.stringify(error.stack)}\``);

    this.bot.logger.admin_error_embed(embed);
  }
}
