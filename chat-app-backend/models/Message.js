const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
    {
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
