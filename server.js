import app from "./app.js";
import { connectDB } from './config/database.js';
import cloudinary from "cloudinary";
import Stripe from "stripe";
connectDB();
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
  });
  
app.listen(process.env.PORT,()=> {
    console.log(`server is listening on port ${process.env.PORT}`)
})
