/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption, PermissionString } from "discord.js";
import { Bot } from "../bot";

export enum InteractionCommandErrors {
  INTERNAL_ERROR = "Ein Fehler ist aufgetreten, bitte versuche es später erneut!",
  INVALID_OPTIONS = "Deine Eingabe scheint fehlerhaft, bitte überprüfe diese noch Einmal!",
  MISSING_PERMISSIONS = "Für diese Interaction fehlen die leider die nötigen Rechte!",
}

export interface Subcommand {
  name: string;
  execute: (interaction: CommandInteraction, options?: CommandInteractionOption[]) => Promise<void> | void;
}

export abstract class InteractionCommand {
  bot: Bot;
  id?: string;

  abstract name: string;
  abstract description: string;

  options: ApplicationCommandOptionData[] = [];

  subcommands: Subcommand[] = [];

  permissions: PermissionString[] = [];

  constructor(bot: Bot) {
    this.bot = bot;
  }

  protected error(interaction: CommandInteraction, errorType: InteractionCommandErrors | string): void {
    interaction.reply(errorType, { ephemeral: true });
  }

  protected deferedError(interaction: CommandInteraction, errorType: InteractionCommandErrors | string): void {
    interaction.editReply(errorType);
  }

  abstract execute(interaction: CommandInteraction, options?: CommandInteractionOption[]): Promise<void> | void;
}
