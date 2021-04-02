/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Guild, GuildMember } from "discord.js";
import { BotJob } from "../classes/job";
import { userGivenRolesModel } from "../models/userGivenRoles";

export class className extends BotJob {
  name = "Rollen zurücksetzen";
  interval = 20000;

  async execute(): Promise<void> {
    userGivenRolesModel.find({ expires: { $lt: Date.now() } }, (error, entries) => {
      if (error) return;

      entries.forEach(async (entry) => {
        const { roleId, userId } = entry;
        const guild: Guild | undefined = this.bot.guilds.cache.get(this.bot.config?.guildId || "");
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
