/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

require("dotenv").config();
const firebase = require("firebase");

const app = firebase.initializeApp({
  apiKey: process.env.FIREBASE_apiKey,
  authDomain: process.env.FIREBASE_authDomain,
  databaseURL: process.env.FIREBASE_databaseURL,
  projectId: process.env.FIREBASE_projectId,
  storageBucket: process.env.FIREBASE_storageBucket,
  messagingSenderId: process.env.FIREBASE_messagingSenderId,
  appId: process.env.FIREBASE_appId,
});
const database = app.database();

module.exports.saveTweets = (_tweets) => {
  for (const tweet of _tweets) {
    database.ref("tweets/" + tweet.id).set(tweet);
  }
};

module.exports.readTweets = (callback) => {
  database.ref("tweets/").on("value", (snapshot) => {
    return callback(snapshot.val());
  });
};
