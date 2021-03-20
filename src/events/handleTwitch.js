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

exports.execute = async (bot, HosttargetMessage) => {
  if (HosttargetMessage) {
    if (HosttargetMessage.wasHostModeEntered()) {
      if (isHosting) return;
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
    return setStreaming(bot, "pegasusspiele", "Pegasus");
  } else {
    if (!isStreaming) return;
    isStreaming = false;
    setDefault(bot);
  }
};
