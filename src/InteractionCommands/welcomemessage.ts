/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, MessageEmbed, PermissionString, Role, TextChannel } from "discord.js";
import { colors } from "../constants/colors";
import { emojis } from "../constants/emojis";
import { InteractionCommand, InteractionCommandErrors, InteractionSubcommand } from "../core/interactions/interactionCommand";
import { WelcomemessageModel } from "../models/welcomemessage";
import { findOption } from "../utils/interactions";
import { stripIndents } from "../utils/stripIndents";

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
    {
      name: "remove",
      type: "SUB_COMMAND",
      description: "Entferne eine Willkommensnachricht zum zuordnen der Rollen.",
      options: [
        { required: true, type: "CHANNEL", name: "channel", description: "In welchem Kanal befindet sich die Nachricht?" },
        { required: true, type: "STRING", name: "messageid", description: "Wie lautet die ID der entsprechenden Nachricht?" },
      ],
    },
  ];
  permissions: PermissionString[] = ["MANAGE_GUILD"];

  subcommands: InteractionSubcommand[] = [
    {
      name: "create",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]): Promise<void> => {
        await interaction.defer(true);
        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { channel: channel } = findOption(options, "channel") as CommandInteractionOption;
        const { role: de_role } = findOption(options, "de-role") as CommandInteractionOption;
        const { role: en_role } = findOption(options, "en-role") as CommandInteractionOption;
        const { value: de_text } = findOption(options, "de-description") as CommandInteractionOption;
        const { value: en_text } = findOption(options, "en-description") as CommandInteractionOption;

        if (!channel || !de_role || !en_role || !de_text || !en_text) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

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
        message.react(emojis.deEmoji);
        message.react(emojis.enEmoji);

        const entry = new WelcomemessageModel();
        entry.messageId = message.id;
        entry.de_roleId = (de_role as Role).id;
        entry.en_roleId = (en_role as Role).id;
        entry.save();

        interaction.editReply("👌");
      },
    },
    {
      name: "remove",
      execute: async (interaction: CommandInteraction, options?: CommandInteractionOption[]): Promise<void> => {
        await interaction.defer(true);
        if (!options) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        const { channel: channel } = findOption(options, "channel") as CommandInteractionOption;
        const { value: messageId } = findOption(options, "messageid") as CommandInteractionOption;

        if (!channel || !messageId) return this.deferedError(interaction, InteractionCommandErrors.INTERNAL_ERROR);

        let messageSuccess = false;
        try {
          const message = await (channel as TextChannel).messages.fetch(messageId as string);
          message.delete();
          messageSuccess = true;
        } catch (error) {}

        const entry = await WelcomemessageModel.findOne({ messageId: messageId as string });

        let dbSuccess = false;
        if (entry) {
          dbSuccess = true;
          entry.remove();
        }

        interaction.editReply(
          stripIndents(`
        Nachricht gelöscht: ${messageSuccess ? "✅" : "❌"}
        Datenbankeintrag entfernt: ${dbSuccess ? "✅" : "❌"}
        `),
        );
      },
    },
  ];

  execute() {}
}
