const fetch = require("node-fetch");
const { MessageAttachment } = require("discord.js");

exports.run = async (bot, msg, args) => {
  fetch(`http://shibe.online/api/birds`)
    .then((res) => res.json())
    .then((json) => fetch(json[0]))
    .then((res) => res.buffer())
    .then((buffer) => {
      msg.channel.send("", new MessageAttachment(buffer));
    });
};

exports.info = {
  name: "piep",
  usage: ["piep"],
  help: "Liefert ein zufälliges Vogelbild zurück.",
  channel: ["718145438339039325", "698189934879571999"],
};
