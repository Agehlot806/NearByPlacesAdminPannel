import mongoose from "mongoose";
const schema = new mongoose.Schema({
  orderItems: [
    {
      image: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "ONLINE"],
    default: "COD",
  },

  paidAt: Date,
  paymentInfo: {
    id: String,
    status: String,
  },

  itemsPrice: {
    type: Number,
    required: true,
  },
  taxPrice: {
    type: Number,
    required: true,
  },
 
  totalAmount: {
    type: Number,
    required: true,
  },

  orderStatus: {
    type: String,
    enum: ["Preparing", "Shipped", "Delivered"],
    default: "Preparing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("Order", schema);