const express = require("express");
const { createChat, getChats, addMessage, getChatDetails, saveMessage } = require("../controllers/chatController");
const { protect } = require("../middlewares/authMiddleware"); // Ensure user is authenticated
const router = express.Router();
const mediaUpload = require("../controllers/mediaController")

router.post("/", protect, createChat); // Create a chat
router.get("/", protect, getChats); // Get all chats for a user
router.get("/:chatId", protect, getChatDetails);
router.post("/message", protect, mediaUpload, saveMessage);
// router.post("/upload", protect, mediaUpload);

module.exports = router;
