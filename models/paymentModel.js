const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    paymentID: {
      type: String,
      required: false,
    },
    address: {
      type: Object,
      required: false,
    },
    cart: {
      type: Array,
      default: [],
    },
    status: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
    },
    total: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payments", paymentSchema);
