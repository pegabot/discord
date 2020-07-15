exports.run = async (bot, msg, args) => {
  const text = args.length < 1 ? "miau" : args[0];
  msg.channel.send(`https://cataas.com/cat/says/${text}?${new Date().getTime()}`);
};

exports.info = {
  name: "miau",
  usage: "miau",
  help: "Returns a random cat image",
};
