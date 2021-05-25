/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, PermissionString } from "discord.js";
import { InteractionCommand, InteractionSubcommand } from "../core/interactions/interactionCommand";

export class InteractionsInteraction extends InteractionCommand {
  name = "interactions";
  description = "Interactions";
  options: ApplicationCommandOptionData[] = [
    {
      name: "uninstall",
      type: "SUB_COMMAND",
      description: "Deinstalliere alle Interactions für diesen Bot.",
    },
  ];
  permissions: PermissionString[] = ["ADMINISTRATOR"];

  subcommands: InteractionSubcommand[] = [
    {
      name: "uninstall",
      execute: async (interaction: CommandInteraction) => {
        await interaction.defer(true);
        await this.bot.interactions.uninstallAll();
        interaction.editReply("Alle Interaction Commands wurden deinstalliert.");
      },
    },
  ];

  execute() {}
}
