/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Message } from "discord.js";
import { Bot } from "./bot";

export abstract class Command {
  bot: Bot;
  abstract name: string;
  abstract usage: string | string[];
  abstract help: string;
  repeatable = true;
  owner?: boolean;
  aliases?: string[];
  category?: string;
  disabled?: boolean;
  lock?: number;
  unlock?: number;
  channel?: string[];
  permissions?: string[];
  roles?: string[];

  constructor(bot: Bot) {
    this.bot = bot;
  }

  abstract execute(msg: Message, args?: string[]): Promise<void> | void;

  protected allNames() {
    return `${this.name}${this.aliases ? " / " + this.aliases?.join("/ ") : ""}`;
  }
}
