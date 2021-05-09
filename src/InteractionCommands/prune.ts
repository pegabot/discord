/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, PermissionString, TextChannel } from "discord.js";
import { InteractionCommand, InteractionCommandErrors } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class PruneInteraction extends InteractionCommand {
  name = "prune";
  description = "Lösche einge gewisse Anzahl an Nachrichten.";
  options: ApplicationCommandOptionData[] = [{ required: true, name: "anzahl", type: "INTEGER", description: "Wie viele Nachrichten möchtest du löschen?" }];
  permissions: PermissionString[] = ["MANAGE_MESSAGES"];

  async fallbackMethod(interaction: CommandInteraction, numberOfMessageToDelete: number) {
    if (!interaction.channel) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

    const messages = await (interaction.channel as TextChannel).messages.fetch({ limit: numberOfMessageToDelete + 1 });

    for (const msgToDelete of messages.values()) {
      if (msgToDelete.deletable) {
        msgToDelete.delete();
      } else {
        interaction.editReply(`Die folgende Nachricht konnte von mir nicht gelöscht werden\n>>> ${msgToDelete.content}`);
      }
    }
    interaction.editReply("Erledigt 👌");
  }

  async execute(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void> {
    interaction.defer(true);

    const option = Number(findOption(options, "anzahl")?.value);
    if (!option) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

    if (option > 99) return this.deferedError(interaction, "Ich kann nicht mehr als 99 Nachrichten auf Einmal löschen.");

    try {
      await (interaction.channel as TextChannel).bulkDelete(option + 1);
      interaction.editReply("Erledigt 👌");
    } catch (error) {
      this.fallbackMethod(interaction, option);
    }
  }
}
