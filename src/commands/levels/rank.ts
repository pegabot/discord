/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import Levels from "discord-xp";
import { Message, MessageAttachment } from "discord.js";
import { BotCommand } from "../../classes/command";
import { LevelModel } from "../../models/levels";
import { BotExecption } from "../../utils/BotExecption";
import { generateRankCard } from "../../utils/leaderboard";
import { resolveUser } from "../../utils/resolveUser";

export class LeaderBoardCommand extends BotCommand {
  name = "rank";
  aliases = ["rang"];
  usage = ["rank", "rank <user>"];
  help = "Zeigt dir deinen Rang oder den Rang von dem Mitglied, welches du übergeben hast, an.";

  async execute(msg: Message): Promise<void> {
    const target = msg.mentions.users.first() || msg.author;
    const user = resolveUser(msg, target.username);

    if (!user) throw new BotExecption("Dieser Benutzer exisitert nicht!");

    const userData = await Levels.fetch(user?.user.id, msg.guild?.id || "");
    if (!userData) {
      msg.channel.send("Sieht so aus, als hätte dieses Mitglied noch keine xp gesammelt.");
      return;
    }

    LevelModel.find({}, async (error, data) => {
      const sorted = data.sort((a, b) => b.xp - a.xp);
      const rank = sorted.findIndex((entry) => entry.userID === user?.user.id) + 1;
      if (rank === 0) rank = sorted.length + 1;
      const rankCard = await generateRankCard({ level: userData.level, xp: userData.xp, rank: rank }, user);
      const attachment = new MessageAttachment(rankCard.toBuffer(), "card.png");
      msg.channel.send("", attachment);
    });
  }
}
