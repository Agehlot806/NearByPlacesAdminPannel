import mongoose from "mongoose";
const schema = new mongoose.Schema({

    phonenumber:Number,
    refreshToken:String,
    uid:String,

});


export const Merchant = mongoose.model("Merchant",schema)