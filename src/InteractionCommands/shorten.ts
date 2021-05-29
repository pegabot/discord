/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption } from "discord.js";
import shortid from "shortid";
import { InteractionCommand, InteractionCommandErrors } from "../core/interactions/interactionCommand";
import { isProduction } from "../utils/environment";
import { findOption } from "../utils/interactions";
import { generateShortUrlKey } from "../utils/redis";
import { stripIndents } from "../utils/stripIndents";

export class shortenInteraction extends InteractionCommand {
  name = "shorten";
  description = "Erstelle einen Kurzlink.";
  options: ApplicationCommandOptionData[] = [{ required: true, type: "STRING", name: "url", description: "Wie lautet die lange URL?" }];

  async execute(interaction: CommandInteraction, options: CommandInteractionOption[]): Promise<void> {
    await interaction.defer();

    const url = findOption(options, "url")?.value?.toString();
    if (!url) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);
    if (!url.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
      return this.deferedError(interaction, "Die übergebene URL scheint nicht korrekt zu sein!");
    }

    const shortID = shortid.generate();

    this.bot.redis.client.set(`${generateShortUrlKey(shortID)}`, url);
    this.bot.redis.client.expire(`${generateShortUrlKey(shortID)}`, 60 * 60 * 24);

    interaction.editReply(
      stripIndents(
        `Deine verkürzte URL lautet: ${isProduction() ? `https://pegabot.pegasus.de/s/${shortID}` : `http://localhost/s/${shortID}`}
        Dieser Link ist 24 Stunden lang gültig.`,
      ),
    );
  }
}
