const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth-controller");

// Register kani
router.post("/register", register);

// Login kani
router.post("/login", login);

module.exports = router;
