require("dotenv").config();
const connectDB = require("./db");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/user");

const app = express();
app.use(express.json());
app.use(cors());
const path = require("path");

// Serve static frontend files
app.use(express.static(path.join(__dirname, "frontend")));


//  Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("! MongoDB error:", err));

// Register API
app.post("/register", async (req, res) => {
  const { fullname, email, username, password } = req.body;

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.json({ success: false, message: "Username or Email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ fullname, email, username, password: hashedPassword });
  await newUser.save();

  res.json({ success: true, message: "Registration successful" });
});

// Login API
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.json({ success: false, message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: "Invalid password" });

  res.json({ success: true, message: "Login successful" });
});


//  Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
