/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Guild, User } from "discord.js";
import { Event } from "../classes/event";

export class guildBanRemoveEvent extends Event {
  execute(guild: Guild, user: User): void {
    this.bot.logger.admin_green(`${user.tag} wurde gerade vom Server entbannt.`);
  }
}
