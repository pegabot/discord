/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Guild, User } from "discord.js";
import { Event } from "../classes/event";

export class guildBanAddEvent extends Event {
  execute(guild: Guild, user: User): void {
    this.bot.logger.admin_red(`${user.tag} wurde gerade vom Server gebannt.`);
  }
}
