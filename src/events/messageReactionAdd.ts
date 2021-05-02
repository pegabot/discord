/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { MessageReaction, User } from "discord.js";
import { Event } from "../classes/event";
import { emojis } from "../constants/emojis";

export class messageReactionAddEvent extends Event {
  async execute(reaction: MessageReaction, user: User): Promise<void> {
    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        return;
      }
    }

    if (user.bot) return;

    if (
      !Object.entries(emojis)
        .map((elt) => elt[1])
        .includes(reaction.emoji.name)
    )
      return;

    switch (reaction.emoji.name) {
      case emojis.rollEmoji:
        this.bot.client.emit("handleReroll", user, reaction);
      default:
        return;
    }
  }
}
