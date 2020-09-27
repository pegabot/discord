exports.run = async (bot, msg, args) => {
  const messages = await msg.channel.messages.fetch();
  for (const msgToDelete of messages.values()) {
    if (msgToDelete.deletable) {
      msgToDelete.delete();
    } else {
      msg.channel.send(`Ich konnte die folgende Nachricht nicht löschen\n>>> ${msgToDelete.content}`);
    }
  }
};

exports.info = {
  name: "clear",
  usage: "clear",
  help: "Löscht alle Nachrichten",
  permissions: ["KICK_MEMBERS"],
};
