import app from "./app.js";
import { connectDB } from './config/database.js';
import cloudinary from "cloudinary";
import Razorpay from "razorpay";
connectDB();

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  });
  
app.listen(process.env.PORT,()=> {
    console.log(`server fsfsfs is listening on port ${process.env.PORT}`)
})
