/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { TextChannel } from "discord.js";
import { BotJob } from "../classes/job";
import { checkVideos, getYoutubeChannelInfos } from "../utils/youtube";
const Youtube = require("simple-youtube-api");

export class YouTubeJob extends BotJob {
  name = "Suche nach neuen YouTube Videos";
  env = "youtube";
  interval = 1000 * 60 * 20;

  YouTubeClient: any;
  YouTubeChannels?: string[];

  setup(): void {
    this.YouTubeClient = new Youtube(this.bot.config.YOUTUBE_KEY);
    this.YouTubeChannels = (this.bot.config.YOUTUBE_CHANNELS || "").split(",").filter((elt) => elt !== "");
  }

  async execute(): Promise<void> {
    try {
      for (const YoutTubeChannel of this.YouTubeChannels || []) {
        const channelInfos = await getYoutubeChannelInfos(this.YouTubeClient, YoutTubeChannel);
        if (!channelInfos) return;
        const video = await checkVideos("https://www.youtube.com/feeds/videos.xml?channel_id=" + channelInfos.id);
        if (!video) continue;

        const guild = this.bot.client.guilds.cache?.get(this.bot.config.guildId || "");
        if (!guild) return;

        const channel = guild.channels.cache.get(this.bot.config.YOUTUBE_CHANNEL || "");
        if (!channel) return;

        (channel as TextChannel).send(
          `Hallo liebe **${guild.name}** Mitglieder, **${channelInfos.raw.snippet.title}** hat gerade ein neues Video auf YouTube veröffentlicht! \n ${video.link}`,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
