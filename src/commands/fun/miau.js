const fetch = require("node-fetch");
const emojiStrip = require("emoji-strip");
const querystring = require("querystring");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg, args) => {
  const text =
    args.length < 1
      ? ["miau"]
      : msg.cleanContent
          .slice(bot.config.prefix.length + 4)
          .trim()
          .split(" ");
  fetch(`https://cataas.com/cat/says/${querystring.escape(emojiStrip(text.join(" ")))}?${new Date().getTime()}&size=50&color=white&type=large`)
    .then((res) => res.buffer())
    .then((buffer) => {
      msg.channel.send("", new MessageAttachment(buffer));
    });
};

exports.info = {
  name: "miau",
  usage: ["miau", "miau <text>"],
  help: "Liefert ein zufälliges Katzen Bild zurück.",
};
