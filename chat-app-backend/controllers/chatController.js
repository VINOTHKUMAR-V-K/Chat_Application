// Import required modules
const Chat = require("../models/Chat"); // Assuming you have a Chat model
const User = require("../models/User");
const Message = require("../models/Message");

// Create a new chat (one-to-one or group)
const createChat = async (req, res) => {
    try {
        const { users, isGroup, chatName } = req.body;

        if (!users || users.length < 2) {
            return res.status(400).json({ message: "At least two users are required to create a chat" });
        }

        const chatData = {
            users,
            isGroup,
            chatName: isGroup ? chatName : null,
        };

        const chat = await Chat.create(chatData);
        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ message: "Error creating chat", error: error.message });
    }
};

// Get all chats for a user
const getChats = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming JWT middleware adds `user` to req

        const chats = await Chat.find({ users: { $in: [userId] } })
            .populate("users", "-password") // Populate user details, excluding passwords
            // .populate("latestMessage")
            .sort({ updatedAt: -1 }); // Sort by latest update

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving chats", error: error.message });
    }
};

// Add a message to a chat
const addMessage = async (req, res) => {
    try {
        const { chatId, content } = req.body;

        const messageData = {
            chat: chatId,
            sender: req.user.id,
            content,
        };

        const message = await Message.create(messageData); // Assuming you have a Message model
        await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: "Error sending message", error: error.message });
    }
};

const getChatDetails = async (req, res) => {
    const { chatId } = req.params;

    try {
        // Fetch the chat
        const chat = await Chat.findById(chatId).populate("users", "name email"); // Optionally populate user details
        if (!chat || !chat.users) {
            return res.status(404).json({ error: "Chat not found" });
        }

        // Fetch all messages for the chat
        const messages = await Message.find({ chat: chatId })
            .sort({ createdAt: 1 }) // Sort by createdAt in ascending order (oldest to newest)
            .populate("sender", "name email"); // Populate sender details

        if (!messages || messages.length === 0) {
            return res.json({
                currentUser: req.user.id,
                currentUserName: req.user.name,
                recipient: chat.isGroup ? {name: chat.chatName} : chat.users.find((user) => user.toString() != req.user.id) || null, // Find the recipient
                messages: [], // Map through all messages to format them
            });
        }

        res.json({
            currentUser: req.user.id,
            currentUserName: req.user.name,
            recipient: chat.users.find((user) => user.toString() != req.user.id) || null, // Find the recipient
            messages: messages.map((msg) => ({
                chat: msg.chat || null,
                content: msg.content || null,
                sender: msg.sender?._id || null,
                senderName: msg.sender?.name || null,
                timestamp: msg.createdAt || null,
                _id: msg._id || null,
            })), // Map through all messages to format them
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch chat details" });
    }
};


const saveMessage = async (req, res) => {
    const { sender, content, chat } = req.query;
    const fileUrl = req.fileUrl; // Retrieved from the middleware

    try {
        const message = await Message.create({
            sender,
            content: fileUrl || content, // Use uploaded file's S3 URL or default content
            chat
        });
        res.status(201).json(message);
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "Failed to save message" });
    }
};



// Export controllers
module.exports = {
    createChat,
    getChats,
    addMessage,
    getChatDetails,
    saveMessage
};
