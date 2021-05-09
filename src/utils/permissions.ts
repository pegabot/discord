/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Guild, PermissionString, Role } from "discord.js";

export const getRolesByPermissionsAndGuild = (guild: Guild, permissions: PermissionString[]): Role[] => {
  return guild.roles.cache
    .filter((role) => {
      return (
        role.permissions.toArray().filter((permission) => {
          return permissions.includes(permission);
        }).length > 0
      );
    })
    .array();
};
