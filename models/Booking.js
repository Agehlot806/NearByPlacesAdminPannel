import mongoose from "mongoose";
const schmea = new mongoose.Schema({
  bookingId:{
    type:String,
    required:true,
    unique:true,
  },
  bookingDate:{
    type:Date,
    required:true,
  },
  BookingItem: [
    {
      fullname: {
        type: String,
        required: true,
      },
      phonenumber: {
        type: Number,
        required: true,
      },
      reservationDate:{
        type:Date,
        required:true,
      },
      reservationTime:{
        type:String,
        required:true,
      }
     
    },
  ],
  StoreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    // required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  Tableprice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  BookingStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Booking = mongoose.model("Booking",schmea);