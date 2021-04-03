/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Role } from "discord.js";
import { BotEvent } from "../classes/event";

export class roleCreateEvent extends BotEvent {
  execute(role: Role): void {
    this.bot.logger?.admin_green(`:inbox_tray: Die Rolle: ${role} **wurde erstellt**.`, `ID: ${role.id}`);
  }
}
