/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, PermissionString, TextChannel } from "discord.js";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";
import { stripIndents } from "../utils/stripIndents";

export class ChannelInteraction extends InteractionCommand {
  name = "channel";
  description = "Channel";
  options: ApplicationCommandOptionData[] = [
    {
      name: "delete",
      type: "SUB_COMMAND",
      description: "Lösche die Känale zur zugehörigen Kategorie und die Kategorie.",
      options: [{ required: true, name: "channel", description: "Welche Kanal soll gelöscht werden?", type: "CHANNEL" }],
    },
    {
      name: "number",
      type: "SUB_COMMAND",
      description: "Wie viele Kanäle existieren gerade?",
    },
  ];

  permissions: PermissionString[] = ["MANAGE_CHANNELS"];

  subcommands: InteractionSubcommand[] = [
    {
      name: "delete",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { channel } = findOption(options, "channel") as CommandInteractionOption;

        const { id: channelID } = channel as TextChannel;

        if (
          this.bot?.config &&
          Object.keys(this.bot?.config)
            .filter((elt) => elt.toLowerCase().match(/.*channel.*/))
            .map((elt) => (this.bot?.config as NodeJS.ProcessEnv)[elt])
            .filter((elt) => elt !== "" && !isNaN(Number(elt)))
            .includes(channelID)
        )
          return this.deferedError(interaction, "Dieser Kanal kann nicht gelöscht werden!");

        interaction.editReply(`Lösche Kanal \`${(channel as TextChannel).name}\`!`);
        (channel as TextChannel).delete();
      },
    },
    {
      name: "number",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer();

        interaction.editReply(
          stripIndents(`
        \`\`\`Kategorien   => ${interaction.guild?.channels.cache.filter((c) => c.type === "category").size}
        News-Kanäle  => ${interaction.guild?.channels.cache.filter((c) => c.type === "news").size}
        Stage-Kanäle => ${interaction.guild?.channels.cache.filter((c) => c.type === "stage").size}
        Store-Kanäle => ${interaction.guild?.channels.cache.filter((c) => c.type === "store").size} 
        Textkanäle   => ${interaction.guild?.channels.cache.filter((c) => c.type === "text").size}
        Sprachkanäle => ${interaction.guild?.channels.cache.filter((c) => c.type === "voice").size}
        =========================
        Gesamt       => ${interaction.guild?.channels.cache.size}
        \`\`\` 
        `),
        );
      },
    },
  ];

  execute() {}
}
