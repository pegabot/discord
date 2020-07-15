exports.run = async (bot, msg) => {
  msg.channel.send(`https://cataas.com/cat/says/miau?${new Date().getTime()}`);
};

exports.info = {
  name: "miau",
  usage: "miau",
  help: "Returns a random cat image",
};
