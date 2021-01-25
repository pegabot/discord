/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  usage: ["queue"],
  aliases: ["playlist", "warteschlange"],
  help: "Zeigt die aktuelle Queue an.",
  channel: ["803042555025293332"],
  execute: async (bot, msg, args) => {
    const queue = bot.jukebox.queue.get(msg.guild.id);
    if (!queue) return msg.channel.send("Aktuell befinden sich keine Titel in der Warteliste!");

    const embed = new MessageEmbed()
      .setAuthor(bot.user.username, bot.user.displayAvatarURL())
      .setTitle(`Aktuell läuft: ${queue.songs[0].title}`)
      .setDescription(
        `***Nächsten Titel:***\n${
          queue.songs
            .slice(1)
            .map((elt) => elt.title)
            .join("\n") || "keine vorhanden"
        }`,
      )
      .setColor("dfc016")
      .setTimestamp(new Date());
    msg.channel.send(embed);
    console.log(queue.songs.slice(1));
  },
};
