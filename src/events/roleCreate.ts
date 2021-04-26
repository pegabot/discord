/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Role } from "discord.js";
import { Event } from "../classes/event";

export class roleCreateEvent extends Event {
  execute(role: Role): void {
    this.bot.logger.admin_green(`:inbox_tray: Die Rolle: ${role} **wurde erstellt**.`, `ID: ${role.id}`);
  }
}
