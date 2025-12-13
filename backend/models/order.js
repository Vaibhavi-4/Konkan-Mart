// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userName: String,
  phone: String,
  amount: Number,
  paymentScreenshot: String, // file path or URL
  paymentVerified: { type: Boolean, default: false },
  status: { type: Number, default: 1 }, // 1=Placed,2=PaymentVerified,3=Packed,4=OutForDelivery,5=Delivered
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
