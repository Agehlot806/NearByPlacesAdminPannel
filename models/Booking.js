import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookingId:{
    type:Number,
    required:true,
  },
  bookingEndTime: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  tableNumber: {
    type: String,
    // required: true,
  },
  table_price:{
   type:Number,
  },
   month :{
   type : String
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  people: {
    type: Number,
    required: true,
  },
  storeName: {
    type: String,
    // required: true,
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
  livelocation: [{
    type: {
      type: String,
      enum: ['Point'],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    },
    formattedAddress: {
      type: String
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zipcode: {
      type: String
    },
    neighbourhood: {
      type: String
    },
    provider: {
      type: String
    }
  }],

});


export const Booking = mongoose.model("Booking",BookingSchema)
