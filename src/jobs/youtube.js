/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Parser = require("rss-parser");
const parser = new Parser();
const Youtube = require("simple-youtube-api");

let YouTubeModel, youtube, channels;
exports.setup = (bot) => {
  YouTubeModel = bot.db.model("youtube");
  youtube = new Youtube(bot.config.YOUTUBE_KEY);
  channels = (bot.config.YOUTUBE_CHANNELS || "").split(",").filter((elt) => elt !== "");
};

async function getLastVideo(rssURL) {
  let content = await parser.parseURL(rssURL);
  let tLastVideos = content.items.sort((a, b) => {
    let aPubDate = new Date(a.pubDate || 0).getTime();
    let bPubDate = new Date(b.pubDate || 0).getTime();
    return bPubDate - aPubDate;
  });
  return tLastVideos[0];
}

async function checkVideos(rssURL) {
  let lastVideo = await getLastVideo(rssURL);
  if (!lastVideo) return;
  const saved_video = await YouTubeModel.find({ video_id: lastVideo.id });
  if (saved_video.length !== 0) return;
  const video_to_save = new YouTubeModel();
  video_to_save.video_id = lastVideo.id;
  await video_to_save.save();
  return lastVideo;
}

function getYoutubeChannelIdFromURL(url) {
  let id = null;
  url = url.replace(/(>|<)/gi, "").split(/(\/channel\/|\/user\/)/);
  if (url[2]) {
    id = url[2].split(/[^0-9a-z_-]/i)[0];
  }
  return id;
}

async function getYoutubeChannelInfos(name) {
  let channel = null;
  let id = getYoutubeChannelIdFromURL(name);
  if (id) {
    channel = await youtube.getChannelByID(id);
  }
  if (!channel) {
    let channels = await youtube.searchChannels(name);
    if (channels.length > 0) {
      channel = channels[0];
    }
  }
  return channel;
}

exports.execute = async (bot) => {
  try {
    for (const channel of channels) {
      const channelInfos = await getYoutubeChannelInfos(channel);
      if (!channelInfos) return;
      const video = await checkVideos("https://www.youtube.com/feeds/videos.xml?channel_id=" + channelInfos.id);
      if (!video) continue;
      const guild = bot.guilds.cache.get(bot.config.guildId);
      guild.channels.cache
        .get(bot.config.YOUTUBE_CHANNEL)
        .send(
          `Hallo liebe **${guild.name}** Mitglieder, **${channelInfos.raw.snippet.title}** hat gerade ein neues Video auf YouTube veröffentlicht! \n ${video.link}`,
        );
    }
  } catch (error) {
    console.error(error);
  }
};

exports.info = {
  name: "YouTube",
  env: "youtube",
  interval: 300000,
};
