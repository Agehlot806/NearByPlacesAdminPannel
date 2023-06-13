import mongoose from "mongoose";
const schema = new mongoose.Schema({
    subname:String,
    subimage:String,
    subprice:String,
    Details:String,
});

export const Subscription = mongoose.model("Subscription",schema);