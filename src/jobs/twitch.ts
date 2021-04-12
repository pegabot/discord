/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { ChatClient } from "dank-twitch-irc";
import { Job } from "../classes/job";

const connect = async (twitchClient: ChatClient) => {
  try {
    await twitchClient.connect();
    twitchClient.join("pegasusspiele");
  } catch {
    connect(twitchClient);
  }
};

export class TwitchJob extends Job {
  name = "Twitch Status";
  interval = 20000;

  setup(): void {
    this.bot.twitchClient.on("HOSTTARGET", (HosttargetMessage) => {
      this.bot.client.emit("handleTwitch", HosttargetMessage);
    });

    connect(this.bot.twitchClient);
  }

  execute(): void {
    this.bot.client.emit("handleTwitch");
  }
}
