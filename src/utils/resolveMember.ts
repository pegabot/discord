/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, GuildMember, Message } from "discord.js";

export const resolveMember = (msg: Message | CommandInteraction, username: string): GuildMember | undefined | null => {
  const memberCache = msg.guild?.members.cache;
  if (!memberCache) return null;

  if (/<@!?\d+>/g.test(username)) {
    return memberCache.get((msg as Message).mentions?.users?.first()?.id || "");
  }

  if (memberCache.has(username)) {
    return memberCache.get(username);
  }

  if (/(.*)#(\d{4})/g.test(username)) {
    return memberCache.find((member) => member.user.tag === username);
  }

  if (memberCache.find((member) => member.nickname === username)) {
    return memberCache.find((member) => member.nickname === username);
  }

  if (memberCache.find((member) => member.user.username === username)) {
    return memberCache.find((member) => member.user.username === username);
  }

  if (memberCache.find((member) => member.id === username)) {
    return memberCache.find((member) => member.id === username);
  }

  return null;
};
