import mongoose from "mongoose";
const schema = new mongoose.Schema({

    Title:{
        type:String
    },
    Link:{
        type:String
    }


});

export const CMS = mongoose.model("CMS",schema);