import mongoose from "mongoose";
const schmea = new mongoose.Schema({
  bookingId:{
    type:String,
    required:true,
    unique:true,
  },
  // bookingDate:{
  //   type: new Date(),
  //   required:true,
  // },
  bookingTime:{
    type:String,
    required:true,
  },
  // BookingItem: [
  //   {
  //     fullname: {
  //       type: String,
  //       required: true,
  //     },
  //     phonenumber: {
  //       type: Number,
  //       required: true,
  //     },
  //     reservationDate:{
  //       type:Date,
  //       required:true,
  //     },
  //     reservationTime:{
  //       type:String,
  //       required:true,
  //     }
  //   },
  // ],
 storename:{
type:String,
 },
 storenumber:{
    type:Number,
 },
 storeimage:{
    type:String,
 },
  userData: [
    {
       userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
       },
       name:{
        type:String,
        required:true,
       },
       email:{
        type:String,
        required:true
       }
      }
  ],
  // paymentInfo: {
  //   id: {
  //     type: String,
  //     required: true,
  //   },
  //   status: {
  //     type: String,
  //     required: true,
  //   },
  // },
  // paidAt: {
  //   type: Date,
  //   required: true,
  // },
  table_price: {
    type: Number,
    required: true,
    default: 0,
  },
  // taxPrice: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  // totalPrice: {
  //   type: Number,
  //   required: true,
  //   default: 0,
  // },
  BookingStatus: {
    type: String,
    required: true,
    default: "Pending",
  },
  tableId:{
    type:mongoose.Schema.Types.ObjectId,
    // required:true,
    ref:"BookingTable",

  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export const Booking = mongoose.model("Booking",schmea);