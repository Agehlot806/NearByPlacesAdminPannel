import mongoose from "mongoose";
const schema = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requried:true,
    },
    username:{
        type:String,
        required:true,
    },
    message:{
        type:String,
    }


})

export const Message  = mongoose.model("Message",schema)