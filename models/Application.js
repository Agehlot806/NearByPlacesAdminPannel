import mongoose from "mongoose";
const schema = new mongoose.Schema({
    categoryname:{
        type:String,
        store: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }],
        required:true,
    },
    categoryImage:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    },
    categoryIcon:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    },
    stores: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Store' }]
})

export const Category = mongoose.model("Category",schema);