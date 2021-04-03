/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Bot } from "./bot";

export abstract class BotEvent {
  constructor(protected bot: Bot) {}

  abstract execute(...args: any): void | Promise<void>;
}
