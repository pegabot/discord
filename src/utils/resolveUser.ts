/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { GuildMember, Message } from "discord.js";

export const resolveUser = (msg: Message, username: any): GuildMember | undefined | null => {
  const memberCache = msg.guild?.members.cache;
  if (!memberCache) return null;

  if (/<@!?\d+>/g.test(username)) {
    return memberCache.get(msg.mentions?.users?.first()?.id || "");
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