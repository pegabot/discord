/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const Twit = require("twit");

let twitter;

exports.setup = (bot) => {
  twitter = new Twit({
    consumer_key: bot.config.TWITTER_CONSUMER_KEY,
    consumer_secret: bot.config.TWITTER_CONSUMER_SECRET,
    access_token: bot.config.TWITTER_TOKEN,
    access_token_secret: bot.config.TWITTER_TOKEN_SECRET,
  });
};

exports.execute = (bot) => {
  twitter.get("search/tweets", { q: "from:pegasusspiele" }, async (error, data, response) => {
    if (error) return;

    const { statuses } = data;

    if (statuses.length < 1) return;

    const TweetModel = bot.db.model("tweet");
    TweetModel.find({}, (error, current_tweets) => {
      if (error) return;

      const entries = statuses
        .filter((elt) => !current_tweets.map((elt) => elt.id).includes(elt.id_str) && elt.retweeted_status === undefined && elt.in_reply_to_status_id === null)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      for (const tweet of entries) {
        const Tweet = new TweetModel();
        Tweet.id = tweet.id_str;
        Tweet.created = tweet.created_at;
        Tweet.username = tweet.user.screen_name;
        Tweet.url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
        Tweet.retweet = tweet.retweeted_status !== undefined;
        Tweet.save((error) => {
          if (error) {
            return;
          }
          const guild = bot.guilds.cache.get(bot.config.guildId);
          guild.channels.cache
            .get(bot.config.TWITTER_CHANNEL)
            .send(`Hallo liebe **${guild.name}** Mitglieder, **@${Tweet.username}** hat gerade einen neuen Tweet gepostet! \n ${Tweet.url}`);
        });
      }
    });
  });
};

exports.info = {
  name: "Tweets",
  env: "twitter",
  interval: 10000,
};
