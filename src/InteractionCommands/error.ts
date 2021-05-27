/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption } from "discord.js";
import { emojis } from "../constants/emojis";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class ErrorInteraction extends InteractionCommand {
  name = "error";
  description = "Error";
  developmentOnly = true;

  options: ApplicationCommandOptionData[] = [
    {
      name: "generate",
      type: "SUB_COMMAND",
      description: "Generiere eine Fehlermeldung.",
      options: [
        { required: true, name: "message", description: "Wie lautet die Fehlernachricht?", type: "STRING" },
        { required: false, name: "title", description: "Wie lautet der Titel?", type: "STRING" },
      ],
    },
  ];

  subcommands: InteractionSubcommand[] = [
    {
      name: "generate",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const title = findOption(options, "title")?.value as string;
        const message = findOption(options, "message")?.value as string;

        if (!title || !message) this.deferedError(interaction, InteractionCommandErrors.INVALID_OPTIONS);
        interaction.editReply(emojis.checkEmoji);
        this.bot.logger.admin_error(new Error(message as string), title as string);
      },
    },
  ];

  execute() {}
}
