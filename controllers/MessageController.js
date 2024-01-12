const Chat = require("../models/chat");
const mongoose = require("mongoose");

const getMessages = async (conversationId) => {
  try {
    const messages = await Chat.findById(conversationId)
      .select("messages")
      .exec();
    return messages ? messages : null;
  } catch (err) {
    return next(err);
  }
};

const postMessage = async (req, res, next) => {
  try {
    const text = req.body.message;
    const sender = req.user._id; // current user
    const conversationId = new mongoose.Types.ObjectId(req.body.conversationId);

    await Chat.findByIdAndUpdate(
      conversationId,
      {
        $push: {
          messages: {
            // push message to messages []
            text,
            sender,
          },
        },
      },
      { new: true, runValidators: true }
    );
    return res.status(201).json({ message: "message success" });
  } catch (err) {
    const error = new Error(err);
    error.statusCode = 500;
    return next(error);
  }
};

module.exports = {
  getMessages,
  postMessage,
};
