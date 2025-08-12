const User = require("../models/auth-model");
const bcrypt = require("bcryptjs");

// REGISTER
const register = async (req, res) => {
  const { name, email, password } = req.body;

  let errors = [];

  if (!name) errors.push({ field: "name", message: "Name is required." });
  if (!email) errors.push({ field: "email", message: "Email is required." });
  if (!password)
    errors.push({ field: "password", message: "Password is required." });

  if (errors.length > 0) return res.status(400).json(errors);

  try {
    const emailExists = await User.findUserByEmail(email);
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.createUser(name, email, hashedPassword);

    res.status(201).json({ message: "User has been created." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
