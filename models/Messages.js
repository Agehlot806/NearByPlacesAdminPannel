import mongoose from "mongoose";
const schema = new mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
            },
            username:{
                type:String,
                required:true,
            },
            message:{
                type:String,
                required:true
            }

})

export const Messages = mongoose.model("Messages",schema);