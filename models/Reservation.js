import mongoose from "mongoose";
const schema  = new mongoose.Schema({

    razorpay_order_id: {
        type: String,
        // required: true,
      },
      razorpay_payment_id: {
        type: String,
        // required: true,
      },
      razorpay_signature: {
        type: String,
        // required: true,
      },
      eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      reservationId: {
        type: String,
        required: true,
      },
      ticketCount: {
        type: Number,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      receipt: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
      },
      notes: {
        type: {
          type: String,
          required: true,
        },
        reservationId: {
          type: String,
          required: true,
        },
      },
      created_at: {
        type: Number,
        required: true,
      },
  
    


})


export const Reservation = mongoose.model("Reservation",schema)
