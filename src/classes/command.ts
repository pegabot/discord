/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Message } from "discord.js";
import { BotType } from "../types/bot";
export abstract class BotCommand {
  bot?: BotType;
  name: string = "";
  usage: string = "";
  help: string = "";
  owner?: boolean;
  aliases?: string[];
  category?: string;
  disabled?: boolean;
  lock?: number;
  unlock?: number;
  channel?: string[];
  permissions?: string[];
  roles?: string[];

  constructor(bot: BotType) {
    this.bot = bot;
  }

  abstract execute(msg: Message, args?: string[]): Promise<void>;
}
