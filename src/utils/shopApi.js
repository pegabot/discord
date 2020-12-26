/*
 * Copyright (c) 2020 Pegasus Spiele Verlags- und Medienvertriebsgesellschaft mbH, all rights reserved.
 */

const bent = require("bent");
const basic = require("basic-authorization-header");

exports.module = {
  getRequest: async (_bot, _url) => {
    try {
      const getJSON = bent("json", {
        Authorization: basic(_bot.config.PEGASUSSHOP_API_USER, _bot.config.PEGASUSSHOP_API_KEY),
      });
      return await getJSON("https://pegasusshop.de/api/" + _url);
    } catch (error) {
      console.error(error);
    }
  },
};
