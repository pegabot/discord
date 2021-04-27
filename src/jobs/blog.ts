/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import { Job } from "../classes/job";
import { BlogPostModel } from "../models/blog";
import { getRequest } from "../utils/shopApi";

export class BlogJob extends Job {
  name = "Suche nach neuen Blogbeiträgen";
  env = "blog";
  interval = 60000;

  async execute(): Promise<void> {
    let {
      data: { data },
    } = await getRequest(
      this.bot,
      `blog/?limit=9999999&filter[0][property]=categoryId&filter[0][expression]=IN&filter[0][value][0]=115&filter[0][value][1]=560&filter[0][value][2]=589&filter[0][value][3]=713`,
    );
    let entries = data;

    const current_blogPosts = await BlogPostModel.find({});

    entries = entries.filter(
      (elt: any) => new Date() > new Date(elt.displayDate) && elt.active && !current_blogPosts.map((elt: any) => elt.blogPost_id).includes(elt.id.toString()),
    );

    for (const entry of entries) {
      const {
        id: postId,
        category: { id: catId },
      } = entry;

      let channelId, url, message;
      switch (catId) {
        case 115:
          channelId = this.bot.config.BLOG_CHANNEL_DE;
          url = `https://pegasus.de/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `Unsere Pressestelle hat eben gerade eine neue Mitteilung veröffentlicht! 📣 ${url}`;
          break;
        case 560:
          channelId = this.bot.config.BLOG_CHANNEL_DE;
          url = `https://pegasus.de/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `Auf unserem Blog ist gerade ein neuer Beitrag erschienen 📄 ${url}`;
          break;
        case 589:
          channelId = this.bot.config.BLOG_CHANNEL_EN;
          url = `https://pegasus-web.com/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `Our US-Team released a new article in our new room 📣  Check it out!${url}`;
          break;
        case 713:
          channelId = this.bot.config.BLOG_CHANNEL_EN;
          url = `https://pegasus-web.com/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `We've added a new article on our blog 📄  Check it out! ${url}`;
          break;
        default:
          continue;
      }

      const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId || "");
      if (!guild) continue;

      const channel = guild.channels.cache.get(channelId || "");
      if (!channel) continue;

      (channel as TextChannel).send(message);

      const blogPost = new BlogPostModel();
      blogPost.blogPost_id = postId;
      blogPost.raw = entry;
      blogPost.url = url;
      blogPost.save();
    }
  }
}
