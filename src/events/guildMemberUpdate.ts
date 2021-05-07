/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { GuildMember, MessageEmbed } from "discord.js";
import prettyMs from "pretty-ms";
import bot from "../bot";
import { Event } from "../classes/event";
import { colors } from "../constants/colors";
import { userGivenRolesModel } from "../models/userGivenRoles";

export default new Event("guildMemberUpdate", async (oldMember, newMember) => {
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

    bot.logger.admin_green(
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
    bot.logger.admin_red(`:inbox_tray: Die Rolle <@&${roleAddLog.changes[0].new[0].id}> wurde von ${executor} dem Benutzer ${target} genommen.`);
  }

  if (oldMember.nickname !== newMember.nickname) {
    newMember.nickname
      ? bot.logger.admin(
          new MessageEmbed()
            .setThumbnail(newMember.user.displayAvatarURL())
            .setDescription(`Der Anzeigename von ${oldMember} hat sich geändert!`)
            .setColor(colors.blue)
            .addField("Alter Anzeigename", oldMember.nickname ? oldMember.nickname : oldMember.user.username, true)
            .addField("Neuer Anzeigename", newMember.nickname, true),
        )
      : bot.logger.admin(
          new MessageEmbed()
            .setThumbnail(newMember.user.displayAvatarURL())
            .setDescription(`Der Anzeigename von ${newMember} wurde entfernt!`)
            .setColor(colors.blue)
            .addField("Alter Anzeigename", oldMember.nickname, true),
        );
  }

  if (oldMember.user.avatar !== newMember.user.avatar) bot.logger.admin_blue(`Das Profilbild von ${newMember} hat sich geändert!`);

  if (oldMember.user.username !== newMember.user.username) bot.logger.admin_blue(`${oldMember} neuer Benutzername ist ${newMember}!`);

  if (oldMember.user.discriminator !== newMember.user.discriminator)
    bot.logger.admin_blue(`${newMember} neuer Diskriminator ist ${newMember.user.discriminator}!`);
});
