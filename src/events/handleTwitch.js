/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  twitch: { checkIfStreaming },
  presence: { setDefault, setStreaming },
} = require("../utils");

let isHosting = false;
let isStreaming = false;

const sendNotification = (bot, name) => {
  const guild = bot.guilds.cache.get(bot.config.guildId);
  guild.channels.cache.get(bot.config.TWITCH_INFO_CHANNEL).send(`📣 ***${name}*** ist eben auf Twitch live gegangen 🍾 \n https://twitch.tv/${name}`);
};

exports.execute = async (bot, HosttargetMessage) => {
  if (HosttargetMessage) {
    if (HosttargetMessage.wasHostModeEntered()) {
      if (isHosting) return;
      if (bot.TWITCH_INFO_CHANNEL) {
      }
      sendNotification(bot, HosttargetMessage.hostedChannelName);
      return setStreaming(bot, HosttargetMessage.hostedChannelName);
    }

    if (HosttargetMessage.wasHostModeExited()) {
      isHosting = false;
      setDefault(bot);
    }
  }

  if (isHosting) return;

  if (await checkIfStreaming("176169616")) {
    if (isStreaming) return;
    isStreaming = true;
    sendNotification(bot, HosttargetMessage.hostedChannelName);
    return setStreaming(bot, "pegasusspiele", "Pegasus");
  } else {
    if (!isStreaming) return;
    isStreaming = false;
    setDefault(bot);
  }
};
