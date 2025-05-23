const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true },
        isGroup: { type: Boolean, default: false },
        users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        // latestMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
