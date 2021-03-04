/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const DisTube = require("distube");
exports.Jukebox = class {
  constructor(bot) {
    this.bot = bot;
    this.tube = new DisTube(bot, { updateYouTubeDL: false, searchSongs: true, leaveOnFinish: true });

    this.tube
      .on("playSong", (message, queue, song) => message.channel.send(`Spiele \`${song.name}\` - \`${song.formattedDuration}\`\nAngefordert von: ${song.user}`))
      .on("addSong", (message, queue, song) =>
        message.channel.send(`Ich habe ${song.name} - \`${song.formattedDuration}\` von ${song.user} zur Warteschlange hinzugefügt`),
      )
      .on("playList", (message, queue, playlist, song) =>
        message.channel.send(
          `Spiele die Playlist: \`${playlist.name}\` (${playlist.songs.length} songs).\nAngefordert von: ${song.user}\nSpiele: \`${song.name}\` - \`${song.formattedDuration}\`}`,
        ),
      )
      .on("addList", (message, queue, playlist) =>
        message.channel.send(`Ich habe die Playliste \`${playlist.name}\` (${playlist.songs.length} songs) zur Warteschlange hinzugefügt}`),
      )
      .on("searchResult", (message, result) => {
        let i = 0;
        message.channel.send(
          `**Suche dir einen Track von unten aus und schreibe die Zahl in den Chat:**\n${result
            .map((song) => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``)
            .join("\n")}\n*Gib irgendetwas ein oder warte 60 Sekunden um abzubrechen*`,
        );
      })
      .on("searchCancel", (message) => message.channel.send(`Suche abgebrochen`))
      .on("error", (message, e) => {
        message.reply("du musst dich in einem Sprachkanal befinden!");
      });
  }

  getQueue(message) {
    return this.tube.getQueue(message);
  }

  play(message, args) {
    this.tube.play(message, args.join(" "));
  }

  loop(message, args) {
    this.tube.setRepeatMode(message, parseInt(args[0]));
  }

  stop(message) {
    this.tube.stop(message);
  }

  skip(message) {
    this.tube.skip(message);
  }
};
