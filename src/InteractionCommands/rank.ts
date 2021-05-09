/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import Levels from "discord-xp";
import { CommandInteraction, MessageAttachment, TextChannel } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { LevelModel } from "../models/levels";
import { generateRankCard } from "../utils/leaderboard";

export class RankInteraction extends InteractionCommand {
  name = "rank";
  description = "Welchen Rang besitzt du gerade?";

  async execute(interaction: CommandInteraction) {
    await interaction.defer();

    const user = interaction.user;

    const userData = await Levels.fetch(user.id, interaction.guild?.id || "");
    if (!userData) return interaction.editReply("Sieht so aus, als hätte dieses Mitglied noch keine xp gesammelt.");

    LevelModel.find({}, async (error, data) => {
      const sorted = data.sort((a, b) => b.xp - a.xp);
      let rank = sorted.findIndex((entry) => entry.userID === user.id) + 1;
      if (rank === 0) rank = sorted.length + 1;
      const rankCard = await generateRankCard({ level: userData.level, xp: userData.xp, rank: rank }, user);
      const attachment = new MessageAttachment(rankCard.toBuffer(), "card.png");
      interaction.editReply("🎉");
      (interaction.channel as TextChannel).send(attachment);
    });
  }
}
