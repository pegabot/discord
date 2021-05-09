/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, GuildMember, PermissionString } from "discord.js";
import { InteractionCommand, InteractionCommandErrors } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class KickInteraction extends InteractionCommand {
  name = "kick";
  description = "User vom Server kicken.";
  options: ApplicationCommandOptionData[] = [{ required: true, name: "opfer", description: "Wer soll den gekickt werden?", type: "USER" }];
  permissions: PermissionString[] = ["KICK_MEMBERS"];

  async execute(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void> {
    await interaction.defer(true);

    const { member } = findOption(options, "opfer") as CommandInteractionOption;

    const victim: GuildMember = member;

    if (!victim) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

    if (victim.id === interaction.user.id) return interaction.editReply("🤦‍♂️ du kannst dich nicht selbst kicken!");

    if (victim.kickable) {
      await victim.kick(`Kick durch ${interaction.user.username}`);
      interaction.editReply("Der Benutzer wurde erfolgreich gekickt!");
    } else {
      interaction.editReply("Der Benutzer konnte nicht gekickt werden!");
    }
  }
}
