const Chat = require("../models/chat");
const mongoose = require("mongoose");
const { getMessages } = require("./MessageController");
const User = require("../models/user");
const { setChatUser } = require("./UserController");

const getChatConversation = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const receiverId = new mongoose.Types.ObjectId(req.body.userId);
    const userIds = [currentUser._id, receiverId];
    // check if userid is exist or not
    const index = currentUser?.userIds.indexOf(receiverId);
    // newly created chat
    if (index < 0) {
      const newChat = await Chat.create({
        users: userIds,
        isRoom: false,
      });
      await setChatUser(currentUser, receiverId, newChat._id); // set user id and chat id
      const chat = await Chat.findById(newChat._id).populate({
        path: "users",
        select: "name email profile",
        match: { _id: { $ne: currentUser._id } }, // Exclude the current user
      });
      return res.status(201).json({
        message: "success",
        data: chat,
        messages: null,
      });
    } else {
      const conversationId = currentUser.chatIds[index]; // get conversation id
      const existChat = await Chat.findById(conversationId)
        .select("-messages")
        .populate({
          path: "users",
          select: "name email profile",
          match: { _id: { $ne: currentUser._id } }, // Exclude the current user in users
        })
        .exec();
      // fetch all message if chat already exist
      const messages = await getMessages(conversationId);
      res.status(200).json({ message: "success", data: existChat, messages });
    }
  } catch (err) {
    const error = new Error(err);
    error.message = "Fail chat";
    return next(error);
  }
};

module.exports = {
  getChatConversation,
};
