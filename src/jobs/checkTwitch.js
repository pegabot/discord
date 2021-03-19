/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  twitch: { isStreaming },
} = require("../utils");

let online = false;

exports.execute = async (bot) => {
  if (await isStreaming("176169616")) {
    if (online) return;
    online = true;
    bot.user.setActivity("Pegasus on Twitch!", {
      type: "STREAMING",
      url: "https://www.twitch.tv/pegasusspiele",
    });
  } else {
    if (!online) return;
    online = false;
    bot.user.setActivity(`${bot.config.prefix}help`, { type: "LISTENING" });
  }
};

exports.info = {
  name: `Prüfe, ob Pegasus Spiele auf Twitch streamt`,
  interval: 60000,
};
