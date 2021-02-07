/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Levels = require("discord-xp");

module.exports = {
  name: "leaderboard",
  usage: ["leaderboard"],
  help: "Gibt das aktuelle Leaderboard aus.",
  execute: async (bot, msg) => {
    const rawLeaderboard = await Levels.fetchLeaderboard(msg.guild.id, 10);

    if (rawLeaderboard.length < 1) return reply("Aktuell befindet sich noch Niemand auf dem Leaderboard.");

    const leaderboard = await Levels.computeLeaderboard(bot, rawLeaderboard, true);

    const lb = leaderboard.map((e) => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);

    msg.channel.send(`**Leaderboard**:\n\n${lb.join("\n\n")}`);
  },
};
