/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import axios from "axios";
import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption } from "discord.js";
import { Card } from "rundenanmeldung/src/types/trello";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

class SpielrundenInteraction extends InteractionCommand {
  name = "spielrunde";
  description = "Spielrunde";
  options: ApplicationCommandOptionData[] = [
    {
      name: "erstellen",
      type: "SUB_COMMAND",
      description: "Hiermit kannst du eine Rundenanfrage direkt an uns übermitteln.",
      options: [
        {
          required: true,
          name: "titel",
          type: "STRING",
          description: "Gib deiner Spielrunde einen Titel",
        },
        {
          required: true,
          name: "spieler",
          type: "INTEGER",
          description: "Wie viele Spieler können mitspielen?",
        },
        {
          required: true,
          name: "system",
          type: "STRING",
          description: "Welches System bietest du an?",
        },
        {
          required: true,
          name: "setting",
          type: "STRING",
          description: " In welchem Setting spielt dein Abenteuer?",
        },
        {
          required: true,
          name: "datum",
          type: "STRING",
          description: "Wann startet deine Spielrunde und wie lange geht sie (tag.monat.jahr stunde.minute (Spieldauer)?",
        },
        {
          required: true,
          name: "beschreibung",
          type: "STRING",
          description: "Worum geht es in dem Abenteuer, das gespielt wird?",
        },
        {
          required: false,
          name: "tisch",
          type: "STRING",
          description: "Wie lautet dein Tisch (wenn du keinen hast, lass dieses Feld leer)?",
        },
        {
          required: false,
          name: "hinweise",
          type: "STRING",
          description: "Gebe wichtige Hinweise an",
        },
        {
          required: false,
          name: "voraussetzungen",
          type: "STRING",
          description: "Gebe technische Voraussetzungen an",
        },
      ],
    },
  ];

  subcommands: InteractionSubcommand[] = [
    {
      name: "erstellen",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const title = findOption(options, "titel")?.value?.toString();
        const players = Number(findOption(options, "spieler")?.value?.toString());
        const system = findOption(options, "system")?.value?.toString();
        const setting = findOption(options, "setting")?.value?.toString();
        const date = findOption(options, "datum")?.value?.toString();
        const desc = findOption(options, "beschreibung")?.value?.toString();
        const table = findOption(options, "tisch")?.value?.toString();
        const notes = findOption(options, "hinweise")?.value?.toString();
        const requirements = findOption(options, "voraussetzungen")?.value?.toString();

        if (!title || !players || !system || !setting || !date || !desc) return this.error(interaction, InteractionCommandErrors.INVALID_OPTIONS);

        const card: Card = {
          title: title,
          desc: desc,
          players: players,
          setting: setting,
          gamemaster: interaction.user.tag,
          notes: notes || "keine",
          requirements: requirements || "keine",
          system: system,
          date: date,
          table: table || "nicht vorhanden",
        };

        try {
          await axios.post("https://register.pegabot.io/api/card", card, { headers: { token: process.env.RUNDENANMELDUNG_API_TOKEN } });
        } catch (error) {
          console.log(error);
          return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);
        }

        interaction.editReply(`Deine Runde wurde eingereicht. Vielen Dank 🎉`);
      },
    },
  ];
  execute() {}
}
