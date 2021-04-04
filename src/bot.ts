/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { Bot } from "./classes/bot";
import { server } from "./server/server";

server.listen(process.env.PORT || 80, () => console.log(`💻 Webserver gestartet!`));

const bot = new Bot();

bot.client.login(bot.config.apiToken);

process.on("unhandledRejection", (error) => {
  bot.client.emit("error", new Error(JSON.stringify(error)));
});

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received.");

  bot.twitchClient?.close();
  bot.client.destroy();

  process.exit(0);
});

export default bot;
