/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  twitch: { checkIfStreaming },
  presence: { setDefault },
} = require("../utils");

let isStreaming = false;

exports.execute = async (bot, HosttargetMessage) => {
  if (HosttargetMessage) {
    if (HosttargetMessage.wasHostModeEntered()) {
      return bot.user.setActivity(`${HosttargetMessage.hostedChannelName} on Twitch!`, {
        type: "STREAMING",
        url: `https://www.twitch.tv/${HosttargetMessage.hostedChannelName}`,
      });
    }
  }

  if (await checkIfStreaming("176169616")) {
    if (isStreaming) return;
    isStreaming = true;
    bot.user.setActivity("Pegasus on Twitch!", {
      type: "STREAMING",
      url: "https://www.twitch.tv/pegasusspiele",
    });
  } else {
    if (!isStreaming) return;
    isStreaming = false;
    setDefault(bot);
  }
};
