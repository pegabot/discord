/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";

export default new Event("handleCommandRepeat", (reaction, user) => {
  if (reaction.message.member?.id !== user.id) {
    reaction.message.channel.send(`${user} nur der ursprüngliche Autor kann einen Command erneut ausführen.`);
    return;
  }
  bot.commands.handleCommand(reaction.message as Message);
});
