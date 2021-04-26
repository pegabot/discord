/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under GNU Affero General Public License v3.0
 * (see https://github.com/pegabot/discord/blob/main/LICENSE for details)
 */

import bent from "bent";

export const checkIfStreaming = async (streamerId: string): Promise<boolean> => {
  try {
    const getJSON = bent("json", {
      "Client-ID": "3zzmx0l2ph50anf78iefr6su9d8byj8",
      Accept: "application/vnd.twitchtv.v5+json",
    });
    const response = await getJSON(`https://api.twitch.tv/kraken/streams/${streamerId}`);
    return response.stream ? true : false;
  } catch (error) {
    console.error(error);
    return false;
  }
};
