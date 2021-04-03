/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import Parser from "rss-parser";
import { YouTubeModel } from "../models/youtube";
const parser = new Parser();

export const getLastVideo = async (rssURL: string) => {
  let content = await parser.parseURL(rssURL);
  let tLastVideos = content.items.sort((a, b) => {
    let aPubDate = new Date(a.pubDate || 0).getTime();
    let bPubDate = new Date(b.pubDate || 0).getTime();
    return bPubDate - aPubDate;
  });
  return tLastVideos[0];
};

export const checkVideos = async (rssURL: string) => {
  let lastVideo = await getLastVideo(rssURL);
  if (!lastVideo) return;
  const saved_video = await YouTubeModel.find({ video_id: lastVideo.id });
  if (saved_video.length !== 0) return;
  const video_to_save = new YouTubeModel();
  video_to_save.video_id = lastVideo.id;
  await video_to_save.save();
  return lastVideo;
};

export const getYoutubeChannelIdFromURL = (_url: string) => {
  let id = null;
  let url = _url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
  if (url[2]) {
    id = url[2].split(/[^0-9a-z_-]/i)[0];
  }
  return id;
};

export const getYoutubeChannelInfos = async (YouTubeClient: any, name: string) => {
  let channel = null;
  let id = getYoutubeChannelIdFromURL(name);
  if (id) {
    channel = await YouTubeClient.getChannelByID(id);
  }
  if (!channel) {
    let channels = await YouTubeClient.searchChannels(name);
    if (channels.length > 0) {
      channel = channels[0];
    }
  }
  return channel;
};
