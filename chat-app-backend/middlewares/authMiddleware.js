const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the authenticated user to the request object
            req.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error("Error with token verification:", error.message);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};


const protectSocket = async (socket, next) => {
    let token;

    if (socket.handshake && socket.handshake.headers.authorization && socket.handshake.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token from header
            token = socket.handshake.headers.authorization.split(" ")[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the authenticated user to the socket object
            socket.user = await User.findById(decoded.id).select("-password");

            next();
        } catch (error) {
            console.error("Error with token verification:", error.message);
            next(new Error("Not authorized, token failed"));
        }
    } else {
        next(new Error("Not authorized, no token"));
    }
};

module.exports = { protect, protectSocket };

