import mongoose from "mongoose";
const schema = new mongoose.Schema({
    categoryname:{
        type:String,
        store: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
        required:true,
    },
    categoryimage:{
       type:String,
    },
    categoryicon:{
       type:String,
    },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }]
})

export const Category = mongoose.model("Category",schema);