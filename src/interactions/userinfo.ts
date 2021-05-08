/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOption, CommandInteraction, GuildMember } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { GuildMemberEmbed } from "../utils/guildMemberEmbed";
import { findOption } from "../utils/interactions";

export class UserinfoInteraction extends InteractionCommand {
  name = "userinfo";
  description = "Möchtest du über einen User mehr wissen?";
  options: ApplicationCommandOption[] = [{ name: "user", type: "USER", required: true, description: "Welchen User möchtest du checken?" }];

  async execute(interaction: CommandInteraction) {
    await interaction.defer();

    const member: GuildMember = findOption(interaction, "user")?.member;

    const embed = GuildMemberEmbed(member);
    interaction.editReply(embed);
  }
}
