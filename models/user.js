const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid E-mail",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  userIds: {
    type: [Schema.Types.ObjectId],
    ref: "User",
  },
  chatIds: {
    type: [Schema.Types.ObjectId],
    ref: "Chat",
  },
  profile: {
    type: String,
    required: false,
  },
});

// hide password field
userSchema.set("toJSON", {
  transform: (
    doc,
    { __v, password, token, userIds, chatIds, ...rest },
    options
  ) => rest,
});

module.exports = mongoose.model("Users", userSchema);
