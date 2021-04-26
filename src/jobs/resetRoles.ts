/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Guild, GuildMember } from "discord.js";
import { Job } from "../classes/job";
import { userGivenRolesModel } from "../models/userGivenRoles";

export class ResetRolesJob extends Job {
  name = "Rollen zurücksetzen";
  interval = 20000;

  execute(): void {
    userGivenRolesModel.find({ expires: { $lt: Date.now() } }, (error, entries) => {
      if (error) return;

      entries.forEach(async (entry) => {
        const { roleId, userId } = entry;
        const guild: Guild | undefined = this.bot.client.guilds.cache.get(this.bot.config.guildId || "");
        if (!guild) return;
        const memberCache = guild.members.cache;
        const member: GuildMember | undefined = memberCache.find((member) => member.id === userId);
        if (!member) return;
        if (member.roles.cache.has(roleId)) {
          member.roles.remove(roleId);
        }
        entry.remove();
      });
    });
  }
}
