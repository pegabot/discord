/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";
import { Bot } from "../bot";

export abstract class BotInteraction {
  bot: Bot;
  abstract name: string;
  abstract description: string;

  options: ApplicationCommandOptionData[] = [];

  constructor(bot: Bot) {
    this.bot = bot;
  }

  abstract execute(interaction: CommandInteraction): Promise<void> | void;
}
