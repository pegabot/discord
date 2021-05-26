/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { User } from "discord.js";
import bot from "../bot";
import { emojis } from "../constants/emojis";
import { Event } from "../core/events/event";

export default new Event("messageReactionAdd", async (reaction, user) => {
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
      .map((elt) => elt[1].toString())
      .includes(reaction.emoji.name || "")
  )
    return;

  const users = reaction.users.fetch();
  if (!(await users).has(bot.client.user?.id || "")) return;

  switch (reaction.emoji.name) {
    case emojis.diceEmoji:
      bot.client.emit("handleReroll", reaction, user as User);
      break;
    case emojis.repeatEmoji:
      bot.client.emit("handleCommandRepeat", reaction, user as User);
      break;
    case emojis.deEmoji:
      bot.client.emit("handleWelcomeMessage", "add", reaction, user as User);
      break;
    case emojis.enEmoji:
      bot.client.emit("handleWelcomeMessage", "add", reaction, user as User);
      break;
    default:
      return;
  }
});
