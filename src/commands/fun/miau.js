exports.run = async (bot, msg, args) => {
  const text = args.length < 1 ? "miau" : args;
  msg.channel.send(`https://cataas.com/cat/says/${text.join("%20")}?${new Date().getTime()}&color=white&size=50&type=or`);
};

//cataas.com/cat/says/Hello?&color=white&size=50&type=or

https: exports.info = {
  name: "miau",
  usage: "miau",
  help: "Returns a random cat image",
};
