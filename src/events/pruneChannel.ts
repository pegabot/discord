/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CommandInteraction, TextChannel } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";
import { InteractionCommand, InteractionCommandErrors } from "../core/interactions/interactionCommand";
import { generateMessageDeletedKey } from "../utils/redis";

const fallbackMethod = async (InteractionCommand: InteractionCommand, interaction: CommandInteraction, numberOfMessageToDelete: number) => {
  if (!interaction.channel) return InteractionCommand.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

  const messages = await (interaction.channel as TextChannel).messages.fetch({ limit: numberOfMessageToDelete + 1 });

  for (const msgToDelete of messages.values()) {
    if (msgToDelete.deletable) {
      const key = generateMessageDeletedKey(msgToDelete);
      bot.redis.client.set(key, "1");
      bot.redis.client.expire(key, 600);
      msgToDelete.delete();
    } else {
      interaction.editReply(`Die folgende Nachricht konnte von mir nicht gelöscht werden\n>>> ${msgToDelete.content}`);
    }
  }
  interaction.editReply("Erledigt 👌");
};

export default new Event("pruneChannel", async (InteractionCommand, interaction, amount) => {
  try {
    await (interaction.channel as TextChannel).bulkDelete(amount + 1);
    interaction.editReply("Erledigt 👌");
  } catch (error) {
    fallbackMethod(InteractionCommand, interaction, amount);
  }
});
