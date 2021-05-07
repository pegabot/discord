/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bot from "../bot";
import { Event } from "../classes/event";

export default new Event("roleCreate", (role) => {
  bot.logger.admin_green(`:inbox_tray: Die Rolle: ${role} **wurde erstellt**.`, `ID: ${role.id}`);
});
