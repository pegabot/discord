const { messaging } = require("firebase");

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

exports.ersetzeUmlaute = (string) => {
  value = string.toLowerCase();
  value = value.replace(/ä/g, "ae");
  value = value.replace(/ö/g, "oe");
  value = value.replace(/ü/g, "ue");
  return value;
};

exports.BotExecption = class {
  constructor(message) {
    this.name = "BotExecption";
    this.message = message;
  }
};
