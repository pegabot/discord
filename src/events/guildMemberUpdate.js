/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot, oldMember, newMember) => {
  if (oldMember.roles.cache.size < newMember.roles.cache.size) {
    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_ROLE_UPDATE",
    });

    const roleAddLog = fetchedLogs.entries.first();
    if (!roleAddLog) return;
    const { executor, target } = roleAddLog;
    bot.logger.admin_green(`:inbox_tray: Die Rolle <@&${roleAddLog.changes[0].new[0].id}> wurde von <@${executor.id}> dem Benutzer <@${target.id}> gegeben.`);
  }

  if (oldMember.roles.cache.size > newMember.roles.cache.size) {
    const fetchedLogs = await oldMember.guild.fetchAuditLogs({
      limit: 1,
      type: "MEMBER_ROLE_UPDATE",
    });

    const roleAddLog = fetchedLogs.entries.first();
    if (!roleAddLog) return;
    const { executor, target } = roleAddLog;
    bot.logger.admin_red(`:inbox_tray: Die Rolle <@&${roleAddLog.changes[0].new[0].id}> wurde von <@${executor.id}> dem Benutzer <@${target.id}> genommen.`);
  }

  if (oldMember.nickname !== newMember.nickname)
    bot.logger.admin_blue(newMember.nickname ? `${oldMember} hat einen neuen Nicknamen!` : `${newMember} hat seinen Nickname entfernt!`);

  if (oldMember.user.avatar !== newMember.user.avatar) bot.logger.admin_blue(`Das Profilbild von ${newMember} hat sich geändert!`);

  if (oldMember.user.username !== newMember.user.username) bot.logger.admin_blue(`${oldMember} neuer Benutzername ist ${newMember}!`);

  if (oldMember.user.discriminator !== newMember.user.discriminator)
    bot.logger.admin_blue(`${newMember} neuer Diskriminator ist ${newMember.user.discriminator}!`);
};
