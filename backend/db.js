//mongodb+srv://cvaibhavi4444_db_user:KonkanMart@5@cluster1.lzjwqx1.mongodb.net/
// backend/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/konkanMartDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

module.exports = connectDB;
