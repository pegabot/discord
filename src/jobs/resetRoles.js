/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

exports.execute = async (bot) => {
  const userGivenRolesModel = bot.db.model("userGivenRoles");

  const entries = await userGivenRolesModel.find({ expires: { $lt: Date.now() } });
  entries.forEach(async (entry) => {
    const { roleId, userId } = entry;
    const guild = bot.guilds.cache.get(bot.config.guildId);
    const memberCache = guild.members.cache;
    const member = memberCache.find((member) => member.id === userId);
    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
    }
    entry.remove();
  });
};

exports.info = {
  name: `Reset Roles`,
  interval: 20000,
};
