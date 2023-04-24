import mongoose from "mongoose";
const schema = new mongoose.Schema({
 
    eventname:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    datebegin:{
        type:Date,
        default:Date.now,
    },
    dateend:{
        type:Date,
        default:Date.now,
    }
    ,
    EventPhoto:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    },
  phonenumber:{
    type:Number,
  },

 website:{
    type:String,
 },

 location:{
    type:Map,
 },

 address:{
    type:String,
 },
    CreatedAt:{
        type:Date,
        default:Date.now,
    },

    status:{
        type:Boolean,
        default:true,
    }
});
schema.set('strictPopulate', false);

export const Event = mongoose.model("Event",schema);