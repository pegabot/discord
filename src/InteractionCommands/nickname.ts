/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, GuildMember } from "discord.js";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { findOption } from "../utils/interactions";

export class NicknameInteraction extends InteractionCommand {
  name = "nickname";
  description = "Nickname.";
  options: ApplicationCommandOptionData[] = [
    {
      name: "add",
      type: "SUB_COMMAND",
      description: "Ändere deinen Nicknamen auf diesem Server.",
      options: [{ required: true, name: "name", type: "STRING", description: "Der Name, der gesetzt werden soll" }],
    },
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Entferne deinen Nicknamen auf diesem Server.",
    },
  ];

  subcommands: InteractionSubcommand[] = [
    {
      name: "add",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]) => {
        await interaction.defer();

        const member: GuildMember = interaction.member as GuildMember;
        if (!member) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        if (member.permissions.has("ADMINISTRATOR")) return interaction.editReply("hey! Du bist Admin 😄 deinen Nicknamen kann ich nicht bearbeiten!");

        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);
        const option = findOption(options, "name");

        await member.setNickname(option?.value as string);
        interaction.editReply(`Dein Nickname wurde in \`${option?.value}\` geändert!`);
      },
    },

    {
      name: "remove",
      execute: async (interaction: CommandInteraction) => {
        await interaction.defer();

        const member: GuildMember = interaction.member as GuildMember;
        if (!member) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        if (member.permissions.has("ADMINISTRATOR")) return interaction.editReply("hey! Du bist Admin 😄 deinen Nicknamen kann ich nicht bearbeiten!");

        await member.setNickname("");
        interaction.editReply("Dein Nickname wurde entfernt!");
      },
    },
  ];

  execute() {}
}
