/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, PermissionString, TextChannel } from "discord.js";
import { InteractionCommand, InteractionCommandErrors, Subcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class SlowmodeInteraction extends InteractionCommand {
  name = "slowmode";
  description = "Lege die Slowmode Rate für diesen Channel fest.";
  options: ApplicationCommandOptionData[] = [
    {
      name: "hinzufügen",
      type: "SUB_COMMAND",
      description: "Lege die Slowmode Rate für diesen Channel fest.",
      options: [{ required: true, type: "STRING", name: "sekunden", description: "Wie viele Sekunden soll die Slowmode Rate betragen?" }],
    },
    {
      name: "entfernen",
      type: "SUB_COMMAND",
      description: "Entferne die Slowmode Rate.",
    },
  ];
  permissions: PermissionString[] = ["MANAGE_CHANNELS"];

  subcommands: Subcommand[] = [
    {
      name: "hinzufügen",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]): Promise<void> => {
        await interaction.defer();

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const option = findOption(options, "sekunden");
        if (!option) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { value } = option;

        if (isNaN(Number(value))) return this.error(interaction, "Dein übergebener Wert ist keine Zahl.");
        await (interaction.channel as TextChannel).setRateLimitPerUser(Number(value));
        const newChannel = await (interaction.channel as TextChannel).fetch();
        interaction.editReply(`Die neue Slowmode Rate beträgt nun ${(newChannel as TextChannel).rateLimitPerUser} Sekunde(n)`);
      },
    },
    {
      name: "entfernen",
      execute: async (interaction: CommandInteraction): Promise<void> => {
        await interaction.defer();

        await (interaction.channel as TextChannel).setRateLimitPerUser(0);
        const newChannel = await (interaction.channel as TextChannel).fetch();
        interaction.editReply(`Die Slowmode Rate wurde entfernt`);
      },
    },
  ];

  execute() {}
}
