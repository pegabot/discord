/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, TextChannel } from "discord.js";
import { InteractionCommand, InteractionErrors } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class SlowmodeInteraction extends InteractionCommand {
  name = "slowmode";
  description = "Lege die Slowmode Rate für diesen Channel fest.";
  options: ApplicationCommandOptionData[] = [
    { required: true, type: "STRING", name: "sekunden", description: "Wie viele Sekunden soll die Slowmode Rate betragen?" },
  ];

  async execute(interaction: CommandInteraction): Promise<void> {
    const option = findOption(interaction, "sekunden");
    if (!option) return this.deferedError(interaction, InteractionErrors.INTERNAL_ERROR);

    const { value } = option;

    if (isNaN(Number(value))) return this.error(interaction, "Dein übergebener Wert ist keine Zahl.");
    await (interaction.channel as TextChannel).setRateLimitPerUser(Number(value));
    const newChannel = await (interaction.channel as TextChannel).fetch();
    interaction.reply(`Die neue Slowmode Rate beträgt nun ${(newChannel as TextChannel).rateLimitPerUser} Sekunde(n)`);
  }
}
