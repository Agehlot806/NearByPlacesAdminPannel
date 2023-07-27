import mongoose, { mongo } from "mongoose";
const schema = new mongoose.Schema({

demoimage:{
    type:String,
    required:true,
}
})


export const S3 = mongoose.model("S3",schema)