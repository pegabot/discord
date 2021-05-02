/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageReaction, User } from "discord.js";
import { Event } from "../classes/event";

export class handleCommandRepeatEvent extends Event {
  async execute(reaction: MessageReaction, user: User): Promise<void> {
    if (reaction.message.member?.id !== user.id) {
      reaction.message.channel.send(`${user} nur der ursprüngliche Autor kann einen Command erneut ausführen.`);
      return;
    }
    this.bot.commands.handleCommand(reaction.message);
  }
}
