/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

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
    this.message = error;
  }
};

//Error message will be sent via direct message to the author
exports.DmExecption = class {
  constructor(message, user) {
    this.name = "DmExecption";
    this.message = message;
    this.user = user;
  }
};

//Error message will be sent via direct message to the author
exports.DmError = class {
  constructor(message, user, error) {
    this.name = "DmError";
    this.message = message;
    this.user = user;
    this.error = error;
  }
};
