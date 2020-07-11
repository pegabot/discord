/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const t = require("./APIs/twitter");
const hook = require("./APIs/discord");

const interval = 10000;

const { saveTweets, readTweets } = require("./Database/firebase");

setInterval(() => {
  readTweets(async (_tweets) => {
    const response = await t.get("search/tweets", { q: "#pnpCONspiracy", count: 100 });
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
      hook.send(`Hey folks, ${tweet.user.screen_name} just posted a new Tweet! \n ${tweet.url}`);
    }
  });
}, interval);
