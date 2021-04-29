/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { Bot } from "./classes/bot";
import { server } from "./server/server";

server.listen(process.env.PORT || 80, () => console.log(`💻 Webserver gestartet!`));

const bot = new Bot();

bot.client.login(bot.config.apiToken);

process.on("unhandledRejection", (error: Error) => {
  bot.client.emit("error", error);
});

process.on("SIGINT", (signal) => {
  bot.destroy(signal);
});

process.on("SIGTERM", (signal) => {
  bot.destroy(signal);
});

export default bot;
