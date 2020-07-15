const fetch = require("node-fetch");
const querystring = require("querystring");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg, args) => {
  const text = args.length < 1 ? ["miau"] : args;
  fetch(`https://cataas.com/cat/says/${querystring.escape(text.join(" "))}?${new Date().getTime()}&size=50&color=white&type=large`)
    .then((res) => res.buffer())
    .then((buffer) => {
      msg.channel.send("", new MessageAttachment(buffer));
    });
};

exports.info = {
  name: "miau",
  usage: ["miau", "miau <text>"],
  help: "Returns a random cat image",
};
