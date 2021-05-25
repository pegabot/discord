/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, TextChannel } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";

export class CleanInteraction extends InteractionCommand {
  name = "clean";
  description = "Als SL kannst du 50 Nachrichten auf Einmal wegschrubben 🧹";
  roles = ["CONspirative"];

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.defer(true);

    if (!((interaction.channel as TextChannel).topic || ("" as String)).match(/https:\/\/trello.com\/c.+/)) {
      return this.deferedError(interaction, "Dieser Kanal hat leider nicht das entsprechende Kanalthema!");
    }

    this.bot.client.emit("pruneChannel", this, interaction, 50);
  }
}
