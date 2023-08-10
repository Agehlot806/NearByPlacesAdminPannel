import mongoose from "mongoose";
const Schema = new mongoose.Schema({
  phone: {
    type: String,
    require: true,
  },
  otp: {
    type: String,
  }
});

export const Otp = mongoose.model("otp", Schema);
