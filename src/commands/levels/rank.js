/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Levels = require("discord-xp");

module.exports = {
  name: "rank",
  usage: ["rank", "rank <user>"],
  help: "Zeigt dir deinen Rang oder den Rang von dem Mitglied, welches du übergeben hast, an.",
  execute: async (bot, msg) => {
    const target = msg.mentions.users.first() || msg.author;

    const user = await Levels.fetch(target.id, msg.guild.id);

    if (!user) return msg.channel.send("Sieht so aus, als hätte dieses Mitglied noch keine xp gesammelt.");

    msg.channel.send(`> **${target.tag}** ist aktuell auf Level ${user.level}.`);
  },
};
