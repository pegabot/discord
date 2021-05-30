/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import shortid from "shortid";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { isProduction } from "../utils/environment";
import { findOption } from "../utils/interactions";
import { generateShortUrlKey } from "../utils/redis";
import { stripIndents } from "../utils/stripIndents";

export class shortenerInteraction extends InteractionCommand {
  name = "shortener";
  description = "shortener";

  options: ApplicationCommandOptionData[] = [
    {
      name: "create",
      type: "SUB_COMMAND",
      description: "Erstelle einen Kurzlink.",
      options: [{ required: true, type: "STRING", name: "url", description: "Wie lautet die lange URL?" }],
    },
    {
      name: "view",
      type: "SUB_COMMAND",
      description: "Bekomme die lange URL zu einem Kurzlink.",
      options: [{ required: true, type: "STRING", name: "input", description: "Wie lautet der Kurzlink?" }],
    },
    {
      name: "delete",
      type: "SUB_COMMAND",
      description: "Lösche einen Kurzlink.",
      options: [{ required: true, type: "STRING", name: "input", description: "Wie lautet der Kurzlink?" }],
    },
  ];

  subcommands: InteractionSubcommand[] = [
    {
      name: "create",
      execute: async (interaction: CommandInteraction, options) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

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
      },
    },
    {
      name: "view",
      execute: async (interaction: CommandInteraction, options) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const input = findOption(options, "input")?.value?.toString();
        if (!input) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        if (input.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
          const parts = input.split("/");
          const shortID = parts[parts.length - 1];

          this.bot.redis.client.get(generateShortUrlKey(shortID), (error, value) => {
            if (error) this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

            if (!value) return interaction.editReply("Dieser Kurzlink wurde nicht gefunden.");
            interaction.editReply(`Die lange URL lautet: ${value}`);
          });
        } else {
          this.bot.redis.client.get(generateShortUrlKey(input), (error, value) => {
            if (error) this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

            if (!value) return interaction.editReply("Dieser Kurzlink wurde nicht gefunden.");
            interaction.editReply(`Die lange URL lautet: ${value}`);
          });
        }
      },
    },
    {
      name: "delete",
      execute: async (interaction: CommandInteraction, options) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const input = findOption(options, "input")?.value?.toString();
        if (!input) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        if (input.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/)) {
          const parts = input.split("/");
          const shortID = parts[parts.length - 1];

          this.bot.redis.client.get(generateShortUrlKey(shortID), (error, value) => {
            if (error) this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

            if (!value) return interaction.editReply("Dieser Kurzlink wurde nicht gefunden.");
            this.bot.redis.client.del(generateShortUrlKey(shortID));
            interaction.editReply(`Der Kurzlink wurde gelöscht.`);
          });
        } else {
          this.bot.redis.client.get(generateShortUrlKey(input), (error, value) => {
            if (error) this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

            if (!value) return interaction.editReply("Dieser Kurzlink wurde nicht gefunden.");
            this.bot.redis.client.del(generateShortUrlKey(input));
            interaction.editReply(`Der Kurzlink wurde gelöscht.`);
          });
        }
      },
    },
  ];

  execute() {}
}
