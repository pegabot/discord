/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { emojis } from "../constants/emojis";
import { Event } from "../core/events/event";
import { WelcomemessageModel } from "../models/welcomemessage";
import { resolveMember } from "../utils/resolveMember";

export default new Event("handleWelcomeMessage", (type, reaction, user) => {
  WelcomemessageModel.find({ messageId: reaction.message.id }, (error, entries) => {
    if (error) throw error;

    if (entries.length < 1) return;

    const { de_roleId, en_roleId } = entries[0];

    const roleId = reaction.emoji.name === emojis.deEmoji ? de_roleId : en_roleId;
    const member = resolveMember(reaction.message as Message, user.id);

    if (!member) return;

    if (type === "add") {
      if (member.roles.cache.has(roleId)) return;
      member.roles.add(roleId);
    } else {
      if (!member.roles.cache.has(roleId)) return;
      member.roles.remove(roleId);
    }
  });
});
