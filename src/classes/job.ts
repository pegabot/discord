/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { BotType } from "../types/bot";

export abstract class BotJob {
  abstract name: string;
  env?: string;
  interval?: number;

  constructor(protected bot: BotType) {}

  setup?(): void | Promise<void>;
  execute?(): void | Promise<void>;
}
