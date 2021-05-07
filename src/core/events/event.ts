/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { CustomClientEvents } from "../../types/discord.js.js";

export class Event<K extends keyof CustomClientEvents> {
  readonly name: K;
  readonly listener: (...args: CustomClientEvents[K]) => void;

  constructor(name: K, listener: (...args: CustomClientEvents[K]) => void) {
    this.name = name;
    this.listener = listener;
  }
}
