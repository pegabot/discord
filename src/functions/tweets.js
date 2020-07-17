const firebase = require("firebase");
const Twit = require("twit");

exports.run = async (bot) => {
  const twitter = new Twit({
    consumer_key: bot.config.TWITTER_CONSUMER_KEY,
    consumer_secret: bot.config.TWITTER_CONSUMER_SECRET,
    access_token: bot.config.TWITTER_TOKEN,
    access_token_secret: bot.config.TWITTER_TOKEN_SECRET,
  });

  const app = firebase.initializeApp({
    apiKey: bot.config.FIREBASE_apiKey,
    authDomain: bot.config.FIREBASE_authDomain,
    databaseURL: bot.config.FIREBASE_databaseURL,
    projectId: bot.config.FIREBASE_projectId,
    storageBucket: bot.config.FIREBASE_storageBucket,
    messagingSenderId: bot.config.FIREBASE_messagingSenderId,
    appId: bot.config.FIREBASE_appId,
  });
  const database = app.database();

  setInterval(() => {
    database.ref("tweets/").once("value", async (resp) => {
      const _tweets = resp.val() || [];

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
        .filter((elt) => !elt.retweet && !Object.keys(_tweets).includes(elt.id))
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

      for (const tweet of parsed_data.filter((elt) => !Object.keys(_tweets).includes(elt.id))) {
        database.ref("tweets/" + tweet.id).set(tweet);
      }

      for (const tweet of parsed_data) {
        const guild = bot.guilds.cache.get(bot.config.GUILD_ID);
        guild.channels.cache.get(bot.config.twitterChannel).send(`Hallo liebe CONspiracy Mitglieder, **@${tweet.user.screen_name}** hat gerade einen neuen Tweet gepostet! \n ${tweet.url}`);
      }
    });
  }, 10000);
};

exports.info = {
  name: "Lade Tweets",
};
