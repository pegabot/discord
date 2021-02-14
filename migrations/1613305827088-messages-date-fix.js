/**
 * Make any changes you need to make to the database here
 */
const mongoose = require("mongoose");
const { schema: MessageSchema } = require("../src/models/message");

async function up() {
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
    console.log(`Updating: ${Message.message.id}`);
    Message.date = new Date(Message.message.createdTimestamp);
    await Message.save();
  }
}

module.exports = { up };
