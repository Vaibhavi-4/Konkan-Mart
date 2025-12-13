import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  screenshot: { type: String, required: true },   // image URL
  status: { type: String, default: "Pending" },    // Pending / Verified / Rejected
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);
