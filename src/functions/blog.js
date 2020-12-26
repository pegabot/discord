/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const {
  shopApi: { getRequest },
  formatBlogTitle,
} = require("../utils");

exports.run = async (bot) => {
  let {
    data: { data: entries },
  } = await getRequest(bot, `blog/?limit=9999999`);

  const BlogModel = bot.db.model("blog");

  const current_blogPosts = await BlogModel.find({});

  entries = entries.filter((elt) => elt.active && !current_blogPosts.map((elt) => elt.blogPost_id).includes(elt.id.toString()));

  for (const entry of entries) {
    try {
      const {
        category: { id: catId },
        title,
      } = entry;

      let url, message;
      switch (catId) {
        case 115:
          url = `https://pegasus.de/presse/pressemitteilungen/${formatBlogTitle(title)}`;
          message = `Unsere Pressestelle hat eben gerade eine neue Mitteilung veröffentlicht! 📣 ${url}`;
          break;
        case 560:
          url = `https://pegasus.de/news/pegasus-spiele-blog/${formatBlogTitle(title)}`;
          message = `Auf unserem Blog ist gerade ein neuer Beitrag erschienen 📄 ${url}`;
          break;
        default:
          continue;
      }

      const guild = bot.guilds.cache.get(bot.config.guildId);
      await guild.channels.cache.get(bot.config.BLOG_CHANNEL).send(message);

      const blogPost = new BlogModel();
      blogPost.blogPost_id = entry.id;
      blogPost.raw = entry;
      blogPost.url = url;
      await blogPost.save();
    } catch (error) {
      continue;
    }
  }
};

exports.info = {
  name: "Checkt, ob neue Blogeinträge auf pegasus.de geposted wurden",
  env: "blog",
  interval: 60000,
};
