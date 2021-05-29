/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import { Task } from "../core/tasks/task";
import { BlogPostModel } from "../models/blog";
import { ReplaceBlogLinksModel } from "../models/replaceBlogLinks";
import { TaskExecption } from "../utils/execptions";
import { getRequest } from "../utils/shopApi";
import { slugify } from "../utils/slugify";

export class BlogTask extends Task {
  name = "Suche nach neuen Blogbeiträgen";
  env = "blog";
  interval = 60000;

  async execute(): Promise<void> {
    let entries;
    try {
      let {
        data: { data },
      } = await getRequest(
        this.bot,
        `blog/?limit=9999999&filter[0][property]=categoryId&filter[0][expression]=IN&filter[0][value][0]=115&filter[0][value][1]=560&filter[0][value][2]=589&filter[0][value][3]=713`,
      );
      entries = data;
    } catch (e) {
      throw new TaskExecption(e, true);
    }

    const current_blogPosts = await BlogPostModel.find({});

    entries = entries.filter(
      (elt: any) => new Date() > new Date(elt.displayDate) && elt.active && !current_blogPosts.map((elt: any) => elt.blogPost_id).includes(elt.id.toString()),
    );

    for (const entry of entries) {
      const {
        id: postId,
        title,
        category: { id: catId },
      } = entry;

      let channelID, rawURL, seoURL, message;
      switch (catId) {
        case 115:
          channelID = this.bot.config.BLOG_CHANNEL_DE;
          rawURL = `https://pegasus.de/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          seoURL = `https://pegasus.de/presse/pressemitteilungen/${slugify(title)}`;
          message = `Unsere Pressestelle hat eben gerade eine neue Mitteilung veröffentlicht! 📣 ${rawURL}`;
          break;
        case 560:
          channelID = this.bot.config.BLOG_CHANNEL_DE;
          rawURL = `https://pegasus.de/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          seoURL = `https://pegasus.de/news/pegasus-spiele-blog/${slugify(title)}`;
          message = `Auf unserem Blog ist gerade ein neuer Beitrag erschienen 📄 ${rawURL}`;
          break;
        case 589:
          channelID = this.bot.config.BLOG_CHANNEL_EN;
          rawURL = `https://pegasus-web.com/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          seoURL = `https://pegasus-web.com/news/${slugify(title)}`;
          message = `Our US-Team released a new article in our news room 📣  Check it out!${rawURL}`;
          break;
        case 713:
          channelID = this.bot.config.BLOG_CHANNEL_EN;
          rawURL = `https://pegasus-web.com/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          seoURL = `https://pegasus-web.com/pegasus-spiele-blog/${slugify(title)}`;
          message = `We've added a new article on our blog 📄  Check it out! ${rawURL}`;
          break;
        default:
          continue;
      }

      const guild = this.bot.client.guilds.cache.get(this.bot.config.guildId || "");
      if (!guild) continue;

      const channel = guild.channels.cache.get(channelID || "");
      if (!channel) continue;

      const sendMessage = await (channel as TextChannel).send(message);
      new ReplaceBlogLinksModel({ channelID: channelID, messageID: sendMessage.id, rawURL: rawURL, seoURL: seoURL }).save();

      const blogPost = new BlogPostModel();
      blogPost.blogPost_id = postId;
      blogPost.raw = entry;
      blogPost.url = rawURL;
      blogPost.save();
    }
  }
}
