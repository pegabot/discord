/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const fetch = require("node-fetch");

exports.stripIndents = (string) => string.replace(/^[ \\t]+/gm, "");

exports.resolveUser = (msg, username) => {
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

exports.BotExecption = class {
  constructor(message) {
    this.name = "BotExecption";
    this.message = message;
  }
};

exports.fetchWithTimeout = (url, options = {}, timeout = 4000) => {
  return Promise.race([fetch(url, options), new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), timeout))]);
};
