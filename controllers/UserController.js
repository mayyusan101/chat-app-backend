const { default: mongoose } = require("mongoose");
const User = require("../models/user");
const Chat = require("../models/chat");

const getLastMessage = async (user, currentUserId) => {
  const userIndex = user.userIds?.indexOf(currentUserId);
  if (userIndex < 0)
    return { _id: user._id, name: user.name, profile: user.profile }; // select user _id and name
  const chatId = user.chatIds[userIndex];
  const allMessages = await Chat.findById(chatId).select("messages");
  const lastMessage = allMessages.messages[allMessages.messages.length - 1]; // reterive the last message
  return {
    _id: user._id,
    name: user.name,
    profile: user.profile,
    lastMessage: lastMessage,
  }; // select user _id, name and add lataMessage
};

const updatedUsers = async (users, currentUserId) => {
  const results = [];
  for (const user of users) {
    const result = await getLastMessage(user._doc, currentUserId);
    results.push(result);
  }
  return results;
};

const getAllUsers = async (req, res, next) => {
  try {
    const currentUser = req.user;
    const users = await User.find({ _id: { $ne: currentUser._id } }).select(
      "name profile userIds chatIds"
    ); // exclude current user
    const usersWithLastMessage = await updatedUsers(users, currentUser._id);
    res
      .status(200)
      .json({ message: "success", data: { users: usersWithLastMessage } });
  } catch (err) {
    return next(err);
  }
};

const setChatUser = async (currentUser, receiverId, conversationId) => {
  currentUser.userIds.push(receiverId); 
  currentUser.chatIds.push(conversationId); // add to chat_ids array with same index chatted_user
  await currentUser.save(); 

  const receiver = await User.findById(new mongoose.Types.ObjectId(receiverId));
  receiver.userIds.push(currentUser._id); 
  receiver.chatIds.push(conversationId); // add to chat_ids array with same index chatted_user
  await receiver.save(); 
  return;
};

const setUserAvatar = async (req, res, next) => {
  try {
    const imagePath = req.body.image;
    const currentUser = req.user;
    currentUser.profile = imagePath;
    await currentUser.save();
    res.status(201).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getAllUsers,
  setChatUser,
  setUserAvatar,
};
