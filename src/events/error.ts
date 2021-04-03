/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { MessageEmbed } from "discord.js";
import { BotEvent } from "../classes/event";

export class errorEvent extends BotEvent {
  execute(error: Error): void {
    const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: ${error}`);

    this.bot.logger.admin_error_embed(embed);
  }
}
