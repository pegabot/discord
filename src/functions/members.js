/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

exports.run = async (bot) => {
  bot.user.setActivity(`${Array.from(bot.guilds.cache)[0][1].members.cache.size} members wohoo 🎉`, { type: "WATCHING" });
};

exports.info = {
  name: "Members Rich Presence",
  env: "members",
  interval: 60000,
};
