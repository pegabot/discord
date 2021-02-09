/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { resolveUser, generateLeaderboardCard } = require("../../utils");
const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "leaderboard",
  aliases: ["leader", "rangliste"],
  usage: ["leaderboard"],
  help: "Gibt das aktuelle Leaderboard aus.",
  execute: async (bot, msg) => {
    const LevelsModel = bot.db.model("Levels");
    LevelsModel.find({}, async (error, data) => {
      if (data.length === 0) return msg.reply("Aktuell befindet sich noch Niemand auf dem Leaderboard.");

      const sorted = data.sort((a, b) => b.xp - a.xp).slice(0, 5);

      let leaderboard = new Array();
      for (const userData of sorted) {
        const user = resolveUser(msg, userData.userID);

        let rank = sorted.findIndex((entry) => entry.userID === user.user.id) + 1;
        if (rank === 0) rank = sorted.length + 1;
        leaderboard.push({ userData: { level: userData.level, xp: userData.xp, rank: rank }, user: user });
      }

      const leaderboardCard = await generateLeaderboardCard(leaderboard);
      const attachment = new MessageAttachment(leaderboardCard.toBuffer(), "card.png");
      msg.channel.send("", attachment);
    });
  },
};
