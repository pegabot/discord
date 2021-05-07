/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Bot } from "../bot";

export abstract class Job {
  abstract name: string;
  env?: string;
  interval?: number;
  stopped = false;

  constructor(protected bot: Bot) {}

  setup?(): void | Promise<void>;
  execute?(): void | Promise<void>;
}
