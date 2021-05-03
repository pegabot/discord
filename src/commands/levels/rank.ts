/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import Levels from "discord-xp";
import { Message, MessageAttachment } from "discord.js";
import { Command } from "../../classes/command";
import { LevelModel } from "../../models/levels";
import { BotExecption } from "../../utils/execptions";
import { generateRankCard } from "../../utils/leaderboard";
import { resolveUser } from "../../utils/resolveUser";

export class LeaderBoardCommand extends Command {
  name = "rank";
  aliases = ["rang"];
  usage = ["rank", "rank <user>"];
  help = "Zeigt dir deinen Rang oder den Rang von dem Mitglied, welches du übergeben hast, an.";

  async execute(msg: Message) {
    const target = msg.mentions.users.first() || msg.author;
    const user = resolveUser(msg, target.username);

    if (!user) throw new BotExecption("Dieser Benutzer exisitert nicht!");

    const userData = await Levels.fetch(user?.user.id, msg.guild?.id || "");
    if (!userData) return msg.channel.send("Sieht so aus, als hätte dieses Mitglied noch keine xp gesammelt.");

    LevelModel.find({}, async (error, data) => {
      const sorted = data.sort((a, b) => b.xp - a.xp);
      let rank = sorted.findIndex((entry) => entry.userID === user?.user.id) + 1;
      if (rank === 0) rank = sorted.length + 1;
      const rankCard = await generateRankCard({ level: userData.level, xp: userData.xp, rank: rank }, user);
      const attachment = new MessageAttachment(rankCard.toBuffer(), "card.png");
      msg.channel.send("", attachment);
    });
  }
}
