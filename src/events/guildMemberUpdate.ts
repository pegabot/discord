/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { GuildMember } from "discord.js";
import { BotEvent } from "../classes/event";
import { userGivenRolesModel } from "../models/userGivenRoles";

const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");

export class guildMemberUpdateEvent extends BotEvent {
  async execute(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    if (oldMember.partial) return;
    if (newMember.partial) return;

    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
      const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_ROLE_UPDATE",
      });

      const roleAddLog = fetchedLogs.entries.first();
      if (!roleAddLog) return;
      const { executor, target } = roleAddLog;

      const userId = (target as GuildMember)?.id;
      if (!roleAddLog.changes) return;
      const roleId = roleAddLog.changes[0].new[0].id;

      const entries = await userGivenRolesModel.find({ userId: userId, roleId: roleId });

      this.bot.logger?.admin_green(
        `:inbox_tray: Die Rolle <@&${roleAddLog?.changes[0].new[0].id}> wurde von ${executor} dem Benutzer ${target} gegeben. ${
          entries.length > 0 ? `Die Rolle wird in ${prettyMs(entries[0].expires - Date.now())} wieder entfernt.` : ""
        }`,
      );
    }

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
      const fetchedLogs = await oldMember.guild.fetchAuditLogs({
        limit: 1,
        type: "MEMBER_ROLE_UPDATE",
      });

      const roleAddLog = fetchedLogs.entries.first();
      if (!roleAddLog) return;
      const { executor, target } = roleAddLog;

      if (!roleAddLog.changes) return;
      this.bot.logger?.admin_red(`:inbox_tray: Die Rolle <@&${roleAddLog.changes[0].new[0].id}> wurde von ${executor} dem Benutzer ${target} genommen.`);
    }

    if (oldMember.nickname !== newMember.nickname) {
      newMember.nickname
        ? this.bot.logger?.admin(
            new MessageEmbed()
              .setThumbnail(newMember.user.displayAvatarURL())
              .setDescription(`Der Anzeigename von ${oldMember} hat sich geändert!`)
              .setColor(this.bot.colors?.blue)
              .addField("Alter Anzeigename", oldMember.nickname ? oldMember.nickname : oldMember.user.username, true)
              .addField("Neuer Anzeigename", newMember.nickname, true),
          )
        : this.bot.logger?.admin(
            new MessageEmbed()
              .setThumbnail(newMember.user.displayAvatarURL())
              .setDescription(`Der Anzeigename von ${newMember} wurde entfernt!`)
              .setColor(this.bot.colors?.blue)
              .addField("Alter Anzeigename", oldMember.nickname, true),
          );
    }

    if (oldMember.user.avatar !== newMember.user.avatar) this.bot.logger?.admin_blue(`Das Profilbild von ${newMember} hat sich geändert!`);

    if (oldMember.user.username !== newMember.user.username) this.bot.logger?.admin_blue(`${oldMember} neuer Benutzername ist ${newMember}!`);

    if (oldMember.user.discriminator !== newMember.user.discriminator)
      this.bot.logger?.admin_blue(`${newMember} neuer Diskriminator ist ${newMember.user.discriminator}!`);
  }
}
