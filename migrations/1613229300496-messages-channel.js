/**
 * Make any changes you need to make to the database here
 */
const mongoose = require("mongoose");
const { schema: MessageSchema } = require("../src/models/message");
const { bot } = require("../src/bot");

async function up() {
  await new Promise(async (resolve, _) => {
    setTimeout(async () => {
      mongoose.connect(process.env.DB_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true,
        useFindAndModify: false,
      });
      mongoose.model("message", MessageSchema);
      const MessageModel = mongoose.model("message");

      const Messages = await MessageModel.find({});
      for (const Message of Messages) {
        if (!Message.channel) {
          const channel = await bot.channels.fetch(Message.message.channelID);
          if (!channel) throw new Error("This is an error. Could not complete migration");
          Message.channel = JSON.parse(JSON.stringify(channel));
          await Message.save();
        }
      }
      resolve(true);
    }, 6000);
  });
}

module.exports = { up };
