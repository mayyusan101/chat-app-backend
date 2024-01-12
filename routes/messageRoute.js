const express = require("express");
const router = express.Router();
const { postMessage } = require("../controllers/MessageController")

router.post("/", postMessage);

module.exports = router;