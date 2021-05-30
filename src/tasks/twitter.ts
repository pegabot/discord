/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import { TextChannel } from "discord.js";
import Twit from "twit";
import { Task } from "../core/tasks/task";

const TWITTER_IDs = ["70936290", "2343758174"]; // @pegasusspiele, @GRT_Orga

export class TwitterTask extends Task {
  name = "Streame Tweets live von Twitter";

  twitter = new Twit({
    consumer_key: this.bot.config.TWITTER_CONSUMER_KEY || "",
    consumer_secret: this.bot.config.TWITTER_CONSUMER_SECRET || "",
    access_token: this.bot.config.TWITTER_TOKEN,
    access_token_secret: this.bot.config.TWITTER_TOKEN_SECRET,
  });

  setup(): void {
    const stream = this.twitter.stream("statuses/filter", {
      follow: TWITTER_IDs,
    });

    stream.on("tweet", (tweet: Twit.Twitter.Status) => {
      const guild = this.bot.client.guilds.cache?.get(this.bot.config.guildId || "");
      if (!guild) return;

      const channel = guild.channels.cache.get(this.bot.config.TWITTER_CHANNEL || "");
      if (!channel) return;

      (channel as TextChannel).send(
        `Hallo liebe **${guild.name}** Mitglieder, **@${
          tweet.user.screen_name
        }** hat gerade einen neuen Tweet gepostet! \n ${`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`}`,
      );
    });
  }
}
