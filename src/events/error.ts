/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { MessageEmbed, TextChannel } from "discord.js";
import { BotEvent } from "../classes/event";

export class errorEvent extends BotEvent {
  execute(error: any): void {
    if (error.partial) return;

    const embed = new MessageEmbed().setTitle(`:x: ein Fehler ist aufgetreten: ${error}`);

    const channel = this.bot.channels.resolve(this.bot.config?.errorChannel || "");
    if (!channel) return;
    (channel as TextChannel).send(embed);
  }
}
