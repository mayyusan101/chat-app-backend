const express = require("express");
const router = express.Router();
const { getAllRooms, createRoom, getRoomConversation, leaveRoom, removeRoom } = require("../controllers/RoomController");


router.get('/', getAllRooms);
router.post('/', createRoom);
router.get('/:roomId', getRoomConversation);
router.post('/leave', leaveRoom);
router.post('/remove', removeRoom);

module.exports = router;