/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { BotJob } from "../classes/job";

import { ChatClient } from "dank-twitch-irc";
const twitchClient = new ChatClient({});

const connect = async () => {
  try {
    await twitchClient.connect();
    twitchClient.join("pegasusspiele");
  } catch {
    connect();
  }
};

export class TwitchJob extends BotJob {
  name = "Twitch Status";
  interval = 20000;

  setup(): void {
    twitchClient.on("HOSTTARGET", (HosttargetMessage) => {
      this.bot.emit("handleTwitch", HosttargetMessage);
    });

    this.bot.twitchClient = twitchClient;
    connect();
  }

  execute(): void {
    this.bot.emit("handleTwitch");
  }
}
