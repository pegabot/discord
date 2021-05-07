/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import bot from "../bot";
import { Bot } from "../classes/bot";
import { Event } from "../classes/event";
import { TwitchModel } from "../models/twitch";
import { setDefault, setStreaming } from "../utils/presence";
import { checkIfStreaming } from "../utils/twitch";

let isHosting = false;
let isStreaming = false;

const sendNotification = (bot: Bot, name: string) => {
  TwitchModel.findOne({}, null, null, (error, doc) => {
    if (error) throw error;

    if (doc?.name === name) return;
    let newDoc = doc || new TwitchModel();
    newDoc.name = name;
    newDoc.save();

    const guild = bot.client.guilds.cache.get(bot.config.guildId || "");
    const channel = guild?.channels.cache.get(bot.config.TWITCH_INFO_CHANNEL || "");
    (channel as TextChannel).send(`📣 ***${name}*** ist eben auf Twitch live gegangen 🍾 \n https://twitch.tv/${name}`);
  });
};

const removeDocuments = () => {
  TwitchModel.find({}, (error, docs) => {
    if (error) throw error;
    for (const doc of docs) {
      doc.delete();
    }
  });
};

export default new Event("handleTwitch", async (HosttargetMessage) => {
  if (HosttargetMessage) {
    if (HosttargetMessage.wasHostModeEntered()) {
      if (isHosting) return;
      if (bot.config.TWITCH_INFO_CHANNEL) {
        sendNotification(bot, HosttargetMessage.hostedChannelName);
      }
      return setStreaming(bot, HosttargetMessage.hostedChannelName);
    }

    if (HosttargetMessage.wasHostModeExited()) {
      isHosting = false;
      setDefault(bot);
      removeDocuments();
    }
  }

  if (isHosting) return;

  if (await checkIfStreaming("176169616")) {
    if (isStreaming) return;
    isStreaming = true;
    if (bot.config.TWITCH_INFO_CHANNEL) {
      sendNotification(bot, HosttargetMessage?.hostedChannelName || "");
    }
    return setStreaming(bot, "pegasusspiele", "Pegasus");
  } else {
    if (!isStreaming) return;
    isStreaming = false;
    setDefault(bot);
    removeDocuments();
  }
});
