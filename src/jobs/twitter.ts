/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

import { TextChannel } from "discord.js";
import { Error } from "mongoose";
import Twit from "twit";
import { BotJob } from "../classes/job";
import { TweetModel } from "../models/tweet";

const TWITTER_USER = ["pegasusspiele", "GRT2014"];

let twitter: Twit;

export class twitterJob extends BotJob {
  name = "Checke auf neue Tweets";
  interval = 20000;

  setup(): void {
    twitter = new Twit({
      consumer_key: this.bot.config?.TWITTER_CONSUMER_KEY || "",
      consumer_secret: this.bot.config?.TWITTER_CONSUMER_SECRET || "",
      access_token: this.bot.config?.TWITTER_TOKEN,
      access_token_secret: this.bot.config?.TWITTER_TOKEN_SECRET,
    });
  }

  execute(): void {
    twitter.get("search/tweets", { q: `from:${TWITTER_USER.join(" OR ")}` }, async (error, data: any, response) => {
      if (error) return;

      const statuses = data.statuses;

      if (statuses.length < 1) return;

      TweetModel.find({}, (error, current_tweets) => {
        if (error) return;

        const entries = statuses
          .filter(
            (elt: Twit.Twitter.Status) =>
              !current_tweets.map((elt) => elt.id).includes(elt.id_str) &&
              TWITTER_USER.includes(elt.user.screen_name) &&
              elt.retweeted_status === undefined &&
              elt.in_reply_to_status_id === null,
          )
          .sort((a: Twit.Twitter.Status, b: Twit.Twitter.Status) => new Date(a.created_at).valueOf() - new Date(b.created_at).valueOf());

        for (const tweet of entries) {
          const Tweet = new TweetModel();
          Tweet.id = tweet.id_str;
          Tweet.created = tweet.created_at;
          Tweet.username = tweet.user.screen_name;
          Tweet.url = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;
          Tweet.retweet = tweet.retweeted_status !== undefined;
          Tweet.save((error: Error) => {
            if (error) {
              return;
            }
            const guild = this.bot.guilds.cache?.get(this.bot.config?.guildId || "");
            if (!guild) return;

            const channel = guild.channels.cache.get(this.bot.config?.TWITTER_CHANNEL || "");
            if (!channel) return;
            (channel as TextChannel).send(
              `Hallo liebe **${guild.name}** Mitglieder, **@${Tweet.username}** hat gerade einen neuen Tweet gepostet! \n ${Tweet.url}`,
            );
          });
        }
      });
    });
  }
}
