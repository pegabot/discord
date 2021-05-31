/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import axios from "axios";
import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption } from "discord.js";
import { Card } from "rundenanmeldung/src/types/trello";
import { pnpSystems } from "rundenanmeldung/ui/src/constants/pnp.json";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class SpielrundenInteraction extends InteractionCommand {
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
          description: "Gebe deiner Spielrunde einen Namen",
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
          choices: pnpSystems.map((elt) => {
            return { name: elt, value: elt };
          }),
          description: "Welches System bietest du an?",
        },
        {
          required: true,
          name: "start",
          type: "STRING",
          description: "Wann startet deine Runde (bsp: 31.05.2021 18:00)?",
        },
        {
          required: true,
          name: "ende",
          type: "STRING",
          description: "Wann endet deine Runde (bsp: 31.05.2021 18:00)?",
        },
        {
          required: true,
          name: "beschreibung",
          type: "STRING",
          description: "Beschreibe deine Runde kurz",
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
        const start = findOption(options, "start")?.value?.toString();
        const end = findOption(options, "ende")?.value?.toString();
        const desc = findOption(options, "beschreibung")?.value?.toString();
        const notes = findOption(options, "hinweise")?.value?.toString();
        const requirements = findOption(options, "voraussetzungen")?.value?.toString();

        if (!title || !players || !system || !start || !end || !desc) return this.error(interaction, InteractionCommandErrors.INVALID_OPTIONS);

        const card: Card = {
          title: title,
          desc: desc,
          players: players,
          gamemaster: interaction.user.tag,
          notes: notes || "keine",
          requirements: requirements || "keine",
          system: system,
          date: `${start}  - ${end}`,
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
