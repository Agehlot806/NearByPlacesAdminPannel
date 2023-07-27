import mongoose, { mongo } from "mongoose";
const schema = new mongoose.Schema({
    baseurl:String,

})

export const ApiConfig = mongoose.model("ApiConfig",schema);