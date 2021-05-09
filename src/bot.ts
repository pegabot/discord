/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Bot } from "./core/bot";
import { server } from "./server/server";
import { isProduction } from "./utils/environment";

server.listen(process.env.PORT || 80, () => console.log(`💻 Webserver gestartet!`));

const bot = new Bot();

bot.client.login(bot.config.apiToken);

process.on("unhandledRejection", (error: Error) => {
  if (!isProduction()) console.error(error.stack);
  bot.client.emit("error", error);
});

process.on("SIGINT", (signal) => {
  bot.destroy(signal);
});

process.on("SIGTERM", (signal) => {
  bot.destroy(signal);
});

export default bot;
