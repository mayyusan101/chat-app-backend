const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatShema = new Schema(
  {
    name: {
      type: String,
    },
    roomAdmin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    users: {
      type: Array,
      ref: "User",
      required: true,
    },
    isRoom: {
      type: Boolean,
      required: true,
    },
    messages: [
      {
        text: {
          type: String,
          required: true,
        },
        sender: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chats", chatShema);
