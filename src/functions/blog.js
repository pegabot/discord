/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const {
  shopApi: { getRequest },
} = require("../utils");

exports.run = async (bot) => {
  let entries;
  try {
    let {
      data: { data },
    } = await getRequest(bot, `blog/?limit=9999999&filter[0][property]=categoryId&filter[0][expression]=IN&filter[0][value][0]=115&filter[0][value][1]=560&filter[0][value][2]=589&filter[0][value][3]=713`);
    entries = data;
  } catch {
    return;
  }

  const BlogModel = bot.db.model("blog");

  const current_blogPosts = await BlogModel.find({});

  entries = entries.filter((elt) => new Date() > new Date(elt.displayDate) && elt.active && !current_blogPosts.map((elt) => elt.blogPost_id).includes(elt.id.toString()));

  for (const entry of entries) {
    try {
      const {
        id: postId,
        category: { id: catId },
      } = entry;

      let channel, url, message;
      switch (catId) {
        case 115:
          channel = bot.config.BLOG_CHANNEL_DE;
          url = `https://pegasus.de/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `<@&${bot.config.notificationRole}>, unsere Pressestelle hat eben gerade eine neue Mitteilung veröffentlicht! 📣 ${url}`;
          break;
        case 560:
          channel = bot.config.BLOG_CHANNEL_DE;
          url = `https://pegasus.de/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `<@&${bot.config.notificationRole}>, auf unserem Blog ist gerade ein neuer Beitrag erschienen 📄 ${url}`;
          break;
        case 589:
          channel = bot.config.BLOG_CHANNEL_EN;
          url = `https://pegasus-web.com/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `<@&${bot.config.notificationRole}>, our US-Team released a new article in our new room 📣  Check it out!${url}`;
          break;
        case 713:
          channel = bot.config.BLOG_CHANNEL_EN;
          url = `https://pegasus-web.com/blog/detail/sCategory/${catId}/blogArticle/${postId}`;
          message = `<@&${bot.config.notificationRole}>, we've added a new article on our blog 📄  Check it out! ${url}`;
          break;
        default:
          continue;
      }

      const guild = bot.guilds.cache.get(bot.config.guildId);
      guild.channels.cache.get(channel).send(message);

      const blogPost = new BlogModel();
      blogPost.blogPost_id = postId;
      blogPost.raw = entry;
      blogPost.url = url;
      blogPost.save();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") console.error(error);
    }
  }
};

exports.info = {
  name: "Blogs",
  env: "blog",
  interval: 60000,
};
