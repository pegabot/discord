const { stripIndents } = require("../../utils");

exports.run = async (bot, msg) => {
  const m = await msg.channel.send("Pong!");
  m.edit(
    stripIndents(
      `Pong!
        Zeit, die in Anspruch genommen wurde: ${m.createdTimestamp - msg.createdTimestamp}ms :timer:
        Ping: ${m.floor(bot.ws.ping)}ms :heartbeat:`,
    ),
  );
};

exports.info = {
  name: "ping",
  usage: "ping",
  help: "Reaktionszeit des Bots",
};
