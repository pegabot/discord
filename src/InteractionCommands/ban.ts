/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, GuildMember, PermissionString } from "discord.js";
import { InteractionCommand, InteractionCommandErrors, Subcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class BanInteraction extends InteractionCommand {
  name = "ban";
  description = "Bann";
  options: ApplicationCommandOptionData[] = [
    {
      name: "add",
      type: "SUB_COMMAND",
      description: "Füge einen Bann hinzu.",
      options: [{ required: true, name: "opfer", description: "Wer soll den Hammer abkriegen?", type: "USER" }],
    },
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Entferne einen Bann.",
      options: [{ required: true, name: "glücklicher", description: "Wer soll begnadigt werden?", type: "USER" }],
    },
  ];

  permissions: PermissionString[] = ["BAN_MEMBERS"];

  subcommands: Subcommand[] = [
    {
      name: "add",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { member } = findOption(options, "opfer") as CommandInteractionOption;

        const victim: GuildMember = member;

        if (!victim) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        if (victim.id === interaction.user.id) return interaction.editReply("🤦‍♂️ du kannst dich nicht selbst bannen!");

        if (victim.bannable) {
          await victim.ban({ reason: `Ban durch ${interaction.user.username}` });
          interaction.editReply("Der Benutzer wurde erfolgreich gebannt!");
        } else {
          interaction.editReply("Der Benutzer konnte nicht gebannt werden!");
        }
      },
    },
    {
      name: "remove",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { member } = findOption(options, "glücklicher") as CommandInteractionOption;

        const winner: GuildMember = member;

        console.log(winner);

        if (!winner) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        if (winner.id === interaction.user.id) return interaction.editReply("🤦‍♂️ du kannst dich nicht selbst enbannen!");

        if (winner.bannable) {
          await interaction.guild?.members.unban(winner.user);
          interaction.editReply("Der Benutzer wurde erfolgreich entbannt!");
        } else {
          interaction.editReply("Der Benutzer konnte nicht entbannt werden!");
        }
      },
    },
  ];

  execute() {}
}
