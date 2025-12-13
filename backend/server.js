require("dotenv").config();
const connectDB = require("./db");
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const multer = require('multer');
const fs =require('fs');
const uploadDir = path.join(__dirname, 'uploads');

const User = require("./models/user");
const Order = require('./models/order');

const app = express();
app.use(express.json());
app.use(cors());
const path = require("path");

// Serve static frontend files
app.use(express.static(path.join(__dirname, "frontend")));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

//  Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("! MongoDB error:", err));

//multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({storage});

// helper orderId generator
function generateOrderId() {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,'');
  const rand = Math.floor(1000 + Math.random()*9000);
  return `KM${date}-${rand}`;
}

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

// Create new order
app.post('/api/order', async (req, res) => {
  const { userName, phone, amount } = req.body;
  const orderId = generateOrderId();
  const order = new Order({ orderId, userName, phone, amount, status: 1 });
  await order.save();
  res.json({ message: 'Order created', orderId });
});

// Upload payment screenshot
app.post('/api/payment/:orderId', upload.single('screenshot'), async (req, res) => {
  const { orderId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const order = await Order.findOneAndUpdate(
    { orderId },
    { paymentScreenshot: `/uploads/${file.filename}`, status: 2 }, // move to payment-verified step only after admin, but set status=2 to reflect received screenshot
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Payment uploaded, pending admin verification', order });
});

// Admin verify payment (simple route; add auth later)
app.put('/api/admin/verify/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOneAndUpdate(
    { orderId },
    { paymentVerified: true, status: 3 }, // after verification set status to Packed (3) or whatever you want
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Payment verified', order });
});

// Track order
app.get('/api/track/:orderId', async (req, res) => {
  const { orderId } = req.params;
  const order = await Order.findOne({ orderId });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ orderId: order.orderId, status: order.status, paymentVerified: order.paymentVerified, paymentScreenshot: order.paymentScreenshot });
});




//  Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
