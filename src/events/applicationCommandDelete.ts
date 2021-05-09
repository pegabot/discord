/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { ApplicationCommand } from "discord.js";
import bot from "../bot";
import { Event } from "../core/events/event";

export default new Event("applicationCommandDelete", (command: ApplicationCommand) => {
  if (command.client.user?.id !== bot.client.user?.id) return;

  bot.logger.admin_red(`📡 Die Interaction \`${command.name}\` **wurde gelöscht**.`);
});
