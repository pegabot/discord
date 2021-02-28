/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const bent = require("bent");
const { MessageEmbed } = require("discord.js");

exports.module = {
  generateParams: (bot, author, dice) => {
    const params = new URLSearchParams();
    params.append("job", "api");
    params.append("source", "Pegabot");
    params.append("user_id", author.id);
    params.append("usr", author.username);
    params.append("api_key", bot.config.ROLLBUTTLER_KEY);
    params.append("api_pass", bot.config.ROLLBUTLER_PASS);
    params.append("roll", dice);
    params.append("logit", "true");
    params.append("lang", "DE");
    params.append("format", "markdown");
    return params;
  },
  roll: (bot, params) => {
    const handler = bent(`https://rollbutler.net/index.php?`, "string", {
      HttpMethod: "GET",
      Headers: {
        Authorization: `BOT ${bot.config.ROLLBUTTLER_KEY}`,
        Accept: "application/json",
        "User-Agent": "Pegabot",
        "Content-Type": "application/json",
      },
    });

    return handler(`${params.toString()}`);
  },

  generateEmbed: (bot, dice, author, response) => {
    const embed = new MessageEmbed();
    embed.setColor(bot.colors.babyblue);
    embed.setTitle(`Ergebnis für ${dice}`);
    embed.setDescription(`${author}, ${response.charAt(0).toLowerCase() + response.slice(1)}`);
    embed.setFooter("powered by RollButler");
    return embed;
  },
};
