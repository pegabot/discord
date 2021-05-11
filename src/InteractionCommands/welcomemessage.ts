/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import {
  ApplicationCommandOptionData,
  CommandInteraction,
  CommandInteractionOption,
  GuildChannel,
  MessageEmbed,
  PermissionString,
  Role,
  TextChannel,
} from "discord.js";
import { colors } from "../constants/colors";
import { emojis } from "../constants/emojis";
import { InteractionCommand, InteractionCommandErrors, Subcommand } from "../core/interactions/interactionCommand";
import { WelcomemessageModel } from "../models/welcomemessage";
import { findOption } from "../utils/interactions";

export class WelcomemessageInteraction extends InteractionCommand {
  name = "welcomemessage";
  description = "Welcomemessage";
  options: ApplicationCommandOptionData[] = [
    {
      name: "create",
      type: "SUB_COMMAND",
      description: "Erstelle eine Willkommensnachricht zum zuordnen der Rollen.",
      options: [
        { required: true, type: "CHANNEL", name: "channel", description: "In welchem Kanal soll die Nachricht angelegt werden?" },
        { required: true, type: "ROLE", name: "de-role", description: "Welche Rolle soll den deutschen Mitgliedern zugeordnet werden?" },
        { required: true, type: "ROLE", name: "en-role", description: "Welche Rolle soll den englischen Mitgliedern zugeordnet werden?" },
        { required: true, type: "STRING", name: "de-description", description: "Wie lautet der deutsche Text?" },
        { required: true, type: "STRING", name: "en-description", description: "Wie lautet der englische Text?" },
      ],
    },
  ];
  permissions: PermissionString[] = ["MANAGE_GUILD"];

  subcommands: Subcommand[] = [
    {
      name: "create",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]): Promise<void> => {
        await interaction.defer(true);
        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { channel: _channel } = findOption(options, "channel") as CommandInteractionOption;
        const { role: _de_role } = findOption(options, "de-role") as CommandInteractionOption;
        const { role: _en_role } = findOption(options, "en-role") as CommandInteractionOption;
        const { value: de_text } = findOption(options, "de-description") as CommandInteractionOption;
        const { value: en_text } = findOption(options, "en-description") as CommandInteractionOption;

        if (!_channel || !_de_role || !_en_role || !de_text || !en_text) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const channel: GuildChannel = _channel;
        const de_role: Role = _de_role;
        const en_role: Role = _en_role;

        const message = await (channel as TextChannel).send(
          new MessageEmbed()
            .setTitle("Willkommen / Welcome 👋🏻")
            .setDescription(
              `
              ${de_text}
              -------------------
              ${en_text}
              `,
            )
            .setTimestamp(Date.now())
            .setColor(colors.red),
        );
        message.react(emojis.deRoleEmoji);
        message.react(emojis.enRoleEmoji);

        const entry = new WelcomemessageModel();
        entry.messageId = message.id;
        entry.de_roleId = de_role.id;
        entry.en_roleId = en_role.id;
        entry.save();

        interaction.editReply("👌");
      },
    },
  ];

  execute() {}
}
