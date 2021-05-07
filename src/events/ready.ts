/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bot from "../bot";
import { version } from "../constants/version";
import { Event } from "../core/events/event";
import { isProduction } from "../utils/environment";
import { setDefault } from "../utils/presence";
import { getSystemStatus } from "../utils/status";

export default new Event("ready", () => {
  bot.commands.loadCommands();
  bot.jobs.loadJobs();

  const message = `${bot.client.user?.username}#${bot.client.user?.discriminator} ist ready!
      -------------------------------
        Version: ${version}
        ID: ${bot.client.user?.id}
        Aktuell in ${bot.client.guilds.cache.size} Guilde(n)
        ${bot.commands.size} Command(s) geladen 🤖
        ${bot.MongoConnector?.size} Models(s) geladen 🧭
        ${bot.events?.size} Event(s) geladen 🎟
        ${bot.jobs?.size} Job(s) aktiviert ⚙️`;

  bot.logger.console(message);
  if (isProduction()) {
    bot.logger.admin(message);
    bot.logger.admin(getSystemStatus());
  }
  setDefault(bot);
});
