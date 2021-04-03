/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { HosttargetMessage } from "dank-twitch-irc";
import { TextChannel } from "discord.js";
import { Bot } from "../classes/bot";
import { BotEvent } from "../classes/event";
import { setDefault, setStreaming } from "../utils/presence";
import { checkIfStreaming } from "../utils/twitch";

let isHosting = false;
let isStreaming = false;

const sendNotification = (bot: Bot, name: string) => {
  const guild = bot.client.guilds.cache.get(bot.config.guildId || "");
  const channel = guild?.channels.cache.get(bot.config.TWITCH_INFO_CHANNEL || "");
  (channel as TextChannel).send(`📣 ***${name}*** ist eben auf Twitch live gegangen 🍾 \n https://twitch.tv/${name}`);
};

export class handleTwitchEvent extends BotEvent {
  async execute(HosttargetMessage: HosttargetMessage) {
    if (HosttargetMessage) {
      if (HosttargetMessage.wasHostModeEntered()) {
        if (isHosting) return;
        if (this.bot.config.TWITCH_INFO_CHANNEL) {
        }
        sendNotification(this.bot, HosttargetMessage.hostedChannelName);
        return setStreaming(this.bot, HosttargetMessage.hostedChannelName);
      }

      if (HosttargetMessage.wasHostModeExited()) {
        isHosting = false;
        setDefault(this.bot);
      }
    }

    if (isHosting) return;

    if (await checkIfStreaming("176169616")) {
      if (isStreaming) return;
      isStreaming = true;
      sendNotification(this.bot, HosttargetMessage.hostedChannelName || "");
      return setStreaming(this.bot, "pegasusspiele", "Pegasus");
    } else {
      if (!isStreaming) return;
      isStreaming = false;
      setDefault(this.bot);
    }
  }
}
