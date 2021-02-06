/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

exports.run = async (bot, oldMember, newMember) => {
  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_ROLE_UPDATE",
    });

    const roleAddLog = fetchedLogs.entries.first();
    if (!roleAddLog) return;
    const { executor, target } = roleAddLog;
    bot.logger.admin(new MessageEmbed().setDescription(`:inbox_tray: Die Rolle <@&${roleAddLog.changes[0].new[0].id}> wurde von <@${executor.id}> dem Benutzer <@${target.id}> gegeben.`).setTimestamp(Date.now()).setColor("#11ee11"));
  }

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_ROLE_UPDATE",
    });

    const roleAddLog = fetchedLogs.entries.first();
    if (!roleAddLog) return;
    const { executor, target } = roleAddLog;
    bot.logger.admin(new MessageEmbed().setDescription(`:inbox_tray: Die Rolle <@&${roleAddLog.changes[0].new[0].id}> wurde von <@${executor.id}> dem Benutzer <@${target.id}> genommen.`).setTimestamp(Date.now()).setColor("#ee1111"));
  }
};
