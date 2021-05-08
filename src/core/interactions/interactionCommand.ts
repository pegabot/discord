/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { Bot } from "../bot";

export enum InteractionErrors {
  INTERNAL_ERROR = "Ein Fehler ist aufgetreten, bitte versuche es später erneut!",
  INVALID_OPTIONS = "Deine Eingabe scheint fehlerhaft, bitte überprüfe diese noch Einmal!",
}

export abstract class InteractionCommand {
  bot: Bot;
  abstract name: string;
  abstract description: string;

  options: ApplicationCommandOptionData[] = [];

  constructor(bot: Bot) {
    this.bot = bot;
  }

  protected error(interaction: CommandInteraction, errorType: InteractionErrors): void {
    interaction.reply(errorType, { ephemeral: true });
  }

  abstract execute(interaction: CommandInteraction): Promise<void> | void;
}
