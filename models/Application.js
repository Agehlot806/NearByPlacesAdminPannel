import mongoose from "mongoose";
const schema = new mongoose.Schema({
    categoryname:{
        type:String,
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
    }
})

export const Category = mongoose.model("Category",schema);