const fetch = require("node-fetch");

exports.run = async (bot, msg, args) => {
  const text = args.length < 1 ? ["miau"] : args;
  fetch(`https://cataas.com/cat/says/${text.join("%20")}?${new Date().getTime()}&color=white&size=50&type=or`)
    .then((res) => res.buffer())
    .then((buffer) => msg.channel.send("", { files: [buffer] }));
};

exports.info = {
  name: "miau",
  usage: "miau",
  help: "Returns a random cat image",
};
