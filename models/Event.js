import mongoose from "mongoose";
const schema = new mongoose.Schema({
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Store"
    },

    usersparticipated:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            eventname:{
                type:String,
                required:true,
            },
            datebegin:{
                type:Date,
                required:true,
            },
            dateend:{
                type:Date,
                required:true,
            },
            status:{
                type:Boolean,
                // required:true,
            },
            ticketCount:{
                type:Number
            }
          
        }
    ],

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
    },
    eventimage:{
        type:String,
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
    },
    EventType:{
        type:String,
        enum:["Paid","Unpaid"],
    }
});
export const Event = mongoose.model("Event",schema);