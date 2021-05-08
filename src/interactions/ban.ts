/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, PermissionString } from "discord.js";
import { InteractionCommand, InteractionErrors } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class BanInteraction extends InteractionCommand {
  name = "ban";
  description = "⚒ wer nicht hören will, muss fühlen.";
  options: ApplicationCommandOptionData[] = [{ required: true, name: "opfer", description: "Wer soll den Hammer abkriegen?", type: "USER" }];
  permissions: PermissionString[] = ["BAN_MEMBERS"];

  async execute(interaction: CommandInteraction): Promise<void> {
    interaction.defer(true);

    const { member: victim } = findOption(interaction, "opfer") as CommandInteractionOption;

    if (!victim) return this.deferedError(interaction, InteractionErrors.INTERNAL_ERROR);

    if (victim.id === interaction.user.id) return interaction.editReply("🤦‍♂️ du kannst dich nicht selbst bannen!");

    if (victim.bannable) {
      await victim.ban({ reason: `Ban durch ${interaction.user.username}` });
      interaction.editReply("Der Benutzer wurde erfolgreich gebannt!");
    } else {
      interaction.editReply("Der Benutzer konnte nicht gebannt werden!");
    }
  }
}
