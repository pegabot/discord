/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.module = (msg, username) => {
  const memberCache = msg.guild.members.cache;
  if (/<@!?\d+>/g.test(username)) {
    return memberCache.get(msg.mentions.users.first().id);
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
