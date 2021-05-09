/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, GuildMember, MessageAttachment, TextChannel } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { LevelModel } from "../models/levels";
import { generateLeaderboardCard } from "../utils/leaderboard";
import { resolveUser } from "../utils/resolveUser";

export interface userData {
  level: number;
  xp: number;
  rank: number;
}

export type Leaderbord = [{ userData: userData; user: GuildMember | null | undefined }?];

export class LeaderboardInteraction extends InteractionCommand {
  name = "leaderbord";
  description = "Wer führt die Rangliste an?";

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.defer();

    LevelModel.find({}, async (error, data) => {
      if (data.length === 0) return interaction.reply("Aktuell befindet sich noch Niemand auf dem Leaderboard.");

      const sorted = data.sort((a, b) => b.xp - a.xp).slice(0, 5);

      let leaderboard: Leaderbord = [];
      for (const userData of sorted) {
        const user = resolveUser(interaction, userData.userID);

        let rank = sorted.findIndex((entry) => entry.userID === user?.user?.id) + 1;
        if (rank === 0) rank = sorted.length + 1;
        leaderboard.push({ userData: { level: userData.level, xp: userData.xp, rank: rank }, user: user });
      }

      const leaderboardCard = await generateLeaderboardCard(leaderboard);
      const attachment = new MessageAttachment(leaderboardCard.toBuffer(), "card.png");
      interaction.editReply("🎉");
      (interaction.channel as TextChannel).send(attachment);
    });
  }
}
