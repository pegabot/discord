/*
 * Copyright (c) 2020 - 2021 The Pegabot authors
 * This code is licensed under MIT license (see LICENSE for details)
 */

const ytdl = require("ytdl-core");

exports.Jukebox = class {
  constructor(bot) {
    this.bot = bot;
    this.queue = new Map();
  }

  async execute(message, serverQueue, args) {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Du musst dich in einem Sprachkanal befinden!");

    let songInfo;
    try {
      songInfo = await ytdl.getInfo(args[0]);
    } catch {
      message.channel.send("Ich konnte dieses Video nicht finden.");
    }

    const song = {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };

    if (!serverQueue) {
      const queueContruct = {
        textChannel: message.channel,
        voiceChannel: voiceChannel,
        connection: null,
        songs: [],
        volume: 5,
        playing: true,
      };

      this.queue.set(message.guild.id, queueContruct);

      queueContruct.songs.push(song);

      try {
        const connection = await voiceChannel.join();
        queueContruct.connection = connection;
        this.play(message.guild, queueContruct.songs[0]);
      } catch (err) {
        queue.delete(message.guild.id);
      }
    } else {
      serverQueue.songs.push(song);
      return message.channel.send(`${song.title} wurde zur Wartschlange hinzugefügt!`);
    }
  }

  skip(message, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send("Du musst dich in einem Sprachkanal befinden, um einen Titel überspringen zu können!");
    if (!serverQueue) return message.channel.send("Es scheint, als gäbe es nichts, was ich überspringen könnte!");
    serverQueue.connection.dispatcher.end();
  }

  stop(message, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send("Du musst dich in einem Sprachkanal befinden, um die Wiedergabe zu stoppen!");

    if (!serverQueue) return message.channel.send("Es scheint, als gäbe es nichts, was ich stoppen könnte!");

    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
  }

  play(guild, song) {
    const serverQueue = this.queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      this.queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        this.play(guild, serverQueue.songs[0]);
      })
      .on("error", (error) => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Spiele: **${song.title}**`);
  }
};
