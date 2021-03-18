/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const bent = require("bent");

exports.module = {
  isStreaming: async (streamerId) => {
    try {
      const getJSON = bent("json", {
        "Client-ID": "3zzmx0l2ph50anf78iefr6su9d8byj8",
        Accept: "application/vnd.twitchtv.v5+json",
      });
      const response = await getJSON(`https://api.twitch.tv/kraken/streams/${streamerId}`);
      return response.stream ? true : false;
    } catch (error) {
      console.error(error);
    }
  },
};
