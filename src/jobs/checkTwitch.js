/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { ChatClient } = require("dank-twitch-irc");
const twitchClient = new ChatClient({});

const connect = async () => {
  try {
    await twitchClient.connect();
    twitchClient.join("pegasusspiele");
  } catch {
    connect();
  }
};

exports.setup = (bot) => {
  twitchClient.on("HOSTTARGET", (HosttargetMessage) => {
    bot.emit("handleTwitch", HosttargetMessage);
  });

  connect();
};

exports.execute = async (bot) => {
  bot.emit("handleTwitch");
};

exports.info = {
  name: `Prüfe, ob Pegasus Spiele auf Twitch streamt`,
  interval: 20000,
};
