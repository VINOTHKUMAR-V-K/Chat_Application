const express = require("express");
const { register, login } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, async (req, res) => {
    res.status(200).json({ message: `Hello, ${req.user.name}` });
});

module.exports = router;
