import mongoose, { Schema }  from "mongoose";
const schema = new mongoose.Schema({
    name:{
        type:String,

    },
    
    storeId: Number,

})

export const Camapgian = mongoose.model("Camapgian",schema)