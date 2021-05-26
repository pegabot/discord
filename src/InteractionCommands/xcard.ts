/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, MessageAttachment, TextChannel } from "discord.js";
import { emojis } from "../constants/emojis";
import { InteractionCommand, InteractionCommandErrors } from "../core/interactions/interactionCommand";
import { RollsModel } from "../models/rolls";
import { fetchWithTimeout } from "../utils/fetchWithTimeout";
import { generateEmbed, generateParams, rollDice } from "../utils/RollButler";

export class XcardInteraction extends InteractionCommand {
  name = "x";
  description = "Spiele eine X-Card aus.";

  async execute(interaction: CommandInteraction): Promise<void> {
    await interaction.defer();

    const dice = "x";

    const params = generateParams(this.bot, interaction.user, dice);

    let response: any = await rollDice(this.bot, params);

    try {
      response = JSON.parse(response);
    } catch {
      return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);
    }

    const channel = await interaction.channel?.fetch();
    if (!channel) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

    let replied;
    if (response?.image) {
      const result: any = await fetchWithTimeout(`https:${response.image}?${new Date().getTime()}`);
      const buffer = await result.buffer();
      replied = await (channel as TextChannel).send(response.message, new MessageAttachment(buffer));
    } else {
      const embed = generateEmbed(this.bot, dice, interaction.user, response);
      replied = await (channel as TextChannel).send(embed);
    }

    interaction.editReply("Ich habe für dich gewürfelt 🎲");

    if (response.message.match(/.*fehlgeschlagen.*/)) return;

    replied.react(emojis.diceEmoji);

    const entry = new RollsModel();
    entry.messageId = replied.id;
    entry.dice = dice;
    entry.save();
  }
}
