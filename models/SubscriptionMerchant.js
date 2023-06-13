import mongoose from "mongoose";
const schema = new mongoose.Schema({
    subname:String,
    subimage:String,
    subprice:Number,
    Details:String,
    validityDays:Number,
});

export const Subscription = mongoose.model("Subscription",schema);