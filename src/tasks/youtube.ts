/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import { Task } from "../core/tasks/task";
import { checkVideos, getYoutubeChannelInfos } from "../utils/youtube";
const Youtube = require("simple-youtube-api");

export class YouTubeTask extends Task {
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
    for (const YoutTubeChannel of this.YouTubeChannels || []) {
      const channelInfos = await getYoutubeChannelInfos(this.YouTubeClient, YoutTubeChannel);
      if (!channelInfos) return;
      const video = await checkVideos("https://www.youtube.com/feeds/videos.xml?channel_id=" + channelInfos.id);
      if (!video) continue;

      const guild = this.bot.client.guilds.cache?.get(this.bot.config.guildId || "");
      if (!guild) return;

      const channel = guild.channels.cache.get(this.bot.config.YOUTUBE_CHANNEL || "");
      if (!channel) return;

      (channel as TextChannel).send(`Auf unserem YoutTube Kanal ist eben ein neues Video aufgetaucht. Schaut vorbei! \n ${video.link}`);
    }
  }
}
