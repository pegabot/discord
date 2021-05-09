/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, MessageAttachment, TextChannel } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";

export class WuffInteraction extends InteractionCommand {
  name = "wuff";
  description = "🐶";

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.defer();

    try {
      const responseJson: any = await fetchWithTimeout(`https://dog.ceo/api/breeds/image/random`);
      const json = await responseJson.json();
      const response: any = await fetchWithTimeout(json.message, {});
      const buffer = await response.buffer();

      interaction.editReply("🐶");
      (interaction.channel as TextChannel).send(new MessageAttachment(buffer));
    } catch (e) {
      interaction.editReply(`<@${interaction.user.id}> es scheint so, als ob ich gerade keine Hundebilder für dich laden kann 🐶`);
    }
  }
}
