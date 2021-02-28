/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { BotExecption } = require("../../utils");
const bent = require("bent");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "roll",
  aliases: ["r"],
  usage: ["roll"],
  help: "Der RollButler eingebaut im Pegabot",
  execute: async (bot, msg, args) => {
    const params = new URLSearchParams();
    params.append("job", "api");
    params.append("source", "Pegabot");
    params.append("user_id", msg.author.id);
    params.append("usr", msg.author.username);
    params.append("api_key", bot.config.ROLLBUTTLER_KEY);
    params.append("api_pass", bot.config.ROLLBUTLER_PASS);
    params.append("roll", "3d6");
    params.append("logit", "true");
    params.append("lang", "DE");
    params.append("format", "markdown");

    const handler = bent(`https://rollbutler.net/index.php?`, "string", {
      HttpMethod: "GET",
      Headers: {
        Authorization: `BOT ${bot.config.ROLLBUTTLER_KEY}`,
        Accept: "application/json",
        "User-Agent": "Pegabot",
        "Content-Type": "application/json",
      },
    });

    const response = await handler(`${params.toString()}`);
    const embed = new MessageEmbed();
    embed.setColor(bot.colors.babyblue);
    embed.setDescription(`${msg.author}, ${response}`);
    embed.setFooter("powered by RollButler");
    msg.reply(embed);
  },
};
