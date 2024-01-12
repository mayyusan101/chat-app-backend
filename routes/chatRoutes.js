const express = require("express");
const router = express.Router();
const { getChatConversation } = require("../controllers/ChatController");

router.post("/", getChatConversation);

module.exports = router;