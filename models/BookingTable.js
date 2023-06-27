import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    // bookingUser:[
    //   {
    //     user:{
    //       type:mongoose.Schema.Types.ObjectId,
    //       ref:"User",
    //       required:true,
    //     },
    //     name:{
    //       type:String,
    //     },
    //     email:{
    //       type:String,
    //     },
    //     phonenumber:{
    //       type:String,
    //     }
    //   }
    // ],
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    // tableNumbers: [{ number: Number, unavailableDates: {type: [Date]}}],
    table_no: {
      type: Number,
      required: true,
    },
     location:
    {
    type:  [String],
    required: true
  },
  store_id:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  tableStatus: {
    type: String,
    required: true,
    default: "Available",
  },
  cancellation_charges:{
    type:Number,
    default:0,
  }
  
  },
  { timestamps: true }
);
export const BookingTable = mongoose.model("BookingTable", schema);