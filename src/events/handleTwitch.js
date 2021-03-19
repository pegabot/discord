/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  twitch: { checkIfStreaming },
  presence: { setDefault },
} = require("../utils");

let isHosting = false;
let isStreaming = false;

exports.execute = async (bot, HosttargetMessage) => {
  if (HosttargetMessage) {
    if (HosttargetMessage.wasHostModeEntered()) {
      if (isHosting) return;
      return bot.user.setActivity(`${HosttargetMessage.hostedChannelName} auf Twitch!`, {
        type: "STREAMING",
        url: `https://www.twitch.tv/${HosttargetMessage.hostedChannelName}`,
      });
    }
  }

  isHosting = false;

  if (await checkIfStreaming("176169616")) {
    if (isStreaming) return;
    isStreaming = true;
    bot.user.setActivity("Pegasus auf Twitch!", {
      type: "STREAMING",
      url: "https://www.twitch.tv/pegasusspiele",
    });
  } else {
    if (!isStreaming) return;
    isStreaming = false;
    setDefault(bot);
  }
};
