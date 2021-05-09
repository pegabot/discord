/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, GuildChannel, PermissionString, TextChannel } from "discord.js";
import { InteractionCommand, InteractionCommandErrors, Subcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

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
  ];

  permissions: PermissionString[] = ["MANAGE_CHANNELS"];

  subcommands: Subcommand[] = [
    {
      name: "delete",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await  interaction.defer(true);

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const option = findOption(options, "channel") as CommandInteractionOption;

        const channel: GuildChannel = option.channel;

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

        interaction.editReply(`Lösche Kanal \`${channel.name}\`!`);
        channel.delete();
      },
    },
  ];

  execute() {}
}
