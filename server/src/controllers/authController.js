const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Complexity rule from Subtask 1.1: min 8 chars, at least 1 number.
const PASSWORD_RE = /^(?=.*\d).{8,}$/;

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
}

// POST /api/auth/signup
// AC: valid email + password (min 8 chars, 1 number) -> new account created.
// AC: invalid credentials or email already in use -> error, no account created.
async function signup(req, res) {
  const { email, password } = req.body;

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email address." });
  }
  if (!password || !PASSWORD_RE.test(password)) {
    return res
      .status(400)
      .json({ error: "Password must be at least 8 characters and include a number." });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "An account with that email already exists." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role: "member" });

  const token = signToken(user);
  return res.status(201).json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
}

// POST /api/auth/login
// AC: valid credentials -> session/token issued, redirect info by role.
// AC: invalid credentials -> error, no session created.
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ error: "Invalid email or password." });
  }

  const token = signToken(user);
  return res.status(200).json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
}

module.exports = { signup, login };
