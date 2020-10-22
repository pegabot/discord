/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.setup = async (bot) => {};

exports.run = async (bot) => {
  let membersCount = 0;
  bot.users.cache.map((users) => (users.id ? (membersCount += 1) : false)).pop();

  bot.user.setActivity(`${membersCount} members wohoo 🎉`, { type: "WATCHING" });
};

exports.info = {
  name: "Members Rich Presence",
  env: "members",
  interval: 1000,
};
