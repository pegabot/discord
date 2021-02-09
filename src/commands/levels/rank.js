/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Levels = require("discord-xp");
const { resolveUser, generateRankCard } = require("../../utils");
const { MessageAttachment } = require("discord.js");

module.exports = {
  name: "rank",
  aliases: ["rang"],
  usage: ["rank", "rank <user>"],
  help: "Zeigt dir deinen Rang oder den Rang von dem Mitglied, welches du übergeben hast, an.",
  execute: async (bot, msg) => {
    const target = msg.mentions.users.first() || msg.author;
    const user = resolveUser(msg, target.username);
    const userData = await Levels.fetch(user.user.id, msg.guild.id);
    if (!userData) return msg.channel.send("Sieht so aus, als hätte dieses Mitglied noch keine xp gesammelt.");

    const LevelsModel = bot.db.model("Levels");
    LevelsModel.find({}, async (error, data) => {
      const sorted = data.sort((a, b) => b.xp - a.xp);
      let rank = sorted.findIndex((entry) => entry.userID === user.user.id) + 1;
      if (rank === 0) rank = sorted.length + 1;
      const rankCard = await generateRankCard({ level: userData.level, xp: userData.xp, rank: rank }, user);
      const attachment = new MessageAttachment(rankCard.toBuffer(), "card.png");
      msg.channel.send("", attachment);
    });
  },
};
