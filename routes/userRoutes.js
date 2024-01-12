const express = require("express");
const router = express.Router();
const { getAllUsers, setUserAvatar } = require("../controllers/UserController");

router.get('/', getAllUsers);   
router.post('/set-avatar', setUserAvatar);   

module.exports = router;