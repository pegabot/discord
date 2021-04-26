/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Bot } from "./bot";

export abstract class Event {
  constructor(protected bot: Bot) {}

  abstract execute(...args: any): void | Promise<void>;
}
