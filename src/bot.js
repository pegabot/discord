/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const twitter = require("./APIs/twitter.config");

const interval = 10000;

const { saveTweets, readTweets } = require("./Database/firebase");

const Discord = require("discord.js");

const client = new Discord.Client();

(async () => {
  setInterval(() => {
    readTweets(async (_tweets) => {
      const response = await twitter.get("search/tweets", { q: "#pnpCONspiracy", count: 100 });
      const data = response.data.statuses;

      const parsed_data = data
        .map((elt) => {
          return {
            created_at: new Date(elt.created_at),
            id: elt.id_str,
            user: {
              screen_name: elt.user.screen_name,
            },
            url: `https://twitter.com/${elt.user.screen_name}/status/${elt.id_str}`,
            retweet: elt.retweeted_status !== undefined,
          };
        })
        .filter((elt) => !elt.retweet && !Object.keys(_tweets).includes(elt.id));

      saveTweets(parsed_data.filter((elt) => !Object.keys(_tweets).includes(elt.id)));

      console.log(`Found: ${parsed_data.length} tweets!`);

      for (const tweet of parsed_data) {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        guild.channels.cache.get(process.env.OUTPUT_ID).send(`Hey folks, ${tweet.user.screen_name} just posted a new Tweet! \n ${tweet.url}`);
      }
    });
  }, interval);

  client.once("ready", () => {
    client.user.setActivity("living in the Cloud ☁️", { type: "WATCHING" });

    console.log("Hello, I am Pegabot 🤖. I am ready!");

    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    guild.channels.cache.get(process.env.MAINTENANCE_ID).send("Hello, I am Pegabot 🤖. I am ready!");
  });

  client.login(process.env.BOT_TOKEN);
})();
