const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const { protectSocket } = require("./middlewares/authMiddleware");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", // Replace with your frontend origin in production
        methods: ["GET", "POST"],
    },
});
// io.use(protectSocket);
// WebSocket setup
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
  
    // Join a chat room
    socket.on("join_chat", (chatId) => {
      if (chatId) {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);
      }
    });
  
    // Handle sending messages
    socket.on("send_message", async (data) => {
      const { sender, content, chat, senderName } = data;
  
      try {
        // Save message to MongoDB
        const message = await Message.create({
          sender,
          content,
          chat,
        });
  
        // Emit the message to the room
        io.to(chat).emit("receive_message", {
          _id: message._id,
          sender,
          senderName,
          content,
          chat,
          timestamp: message.createdAt,
        });
  
        console.log("Message sent to room:", chat);
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });
  
    // Handle leaving chat room
    socket.on("leave_chat", (chatId) => {
      if (chatId) {
        socket.leave(chatId);
        console.log(`User left chat room: ${chatId}`);
      }
    });
  
    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  
  // Start the server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));