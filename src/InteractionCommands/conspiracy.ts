/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction } from "discord.js";
import { InteractionCommand } from "../core/interactions/interactionCommand";

export class ConspiracyInteraction extends InteractionCommand {
  name = "conspiracy";
  description = "Wann findet die nächste CONspiracy statt?";

  execute(interaction: CommandInteraction) {
    interaction.reply("Die nächste CONspiracy findet vom 18.06.2021 bis zum 20.06.2021 statt.");
  }
}
