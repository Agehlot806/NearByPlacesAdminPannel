import mongoose from "mongoose";
const schema  = new mongoose.Schema({

    razorpay_order_id: {
        type: String,
        required: true,
      },
      razorpay_payment_id: {
        type: String,
        required: true,
      },
      razorpay_signature: {
        type: String,
        required: true,
      },
      eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event"
      }
    


})


export const Reservation = mongoose.model("Reservation",schema)