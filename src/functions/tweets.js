/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
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

exports.run = async (bot) => {
  const TweetModel = bot.db.model("tweet");

  const response = await twitter.get("search/tweets", { q: "from:pegasusspiele" });
  for (const tweet of response.data.statuses.filter((elt) => elt.retweeted_status === undefined && elt.in_reply_to_status_id === null).sort((a, b) => new Date(a.created_at) - new Date(b.created_at))) {
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
      guild.channels.cache.get(bot.config.TWITTER_CHANNEL).send(`Hallo liebe **${guild.name}** Mitglieder, **@${Tweet.username}** hat gerade einen neuen Tweet gepostet! \n ${Tweet.url}`);
    });
  }
};

exports.info = {
  name: "Tweets",
  env: "twitter",
  interval: 10000,
};
