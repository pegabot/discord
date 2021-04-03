/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { ChatClient } from "dank-twitch-irc";
import { BotJob } from "../classes/job";

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
      this.bot.client.emit("handleTwitch", HosttargetMessage);
    });

    this.bot.twitchClient = twitchClient;
    connect();
  }

  execute(): void {
    this.bot.client.emit("handleTwitch");
  }
}
