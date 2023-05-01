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
            }
          
        }
    ],

    // reviews: [
    //     {
    //       user: {
    //         type: mongoose.Schema.ObjectId,
    //         ref: "User",
    //         required: true,
    //       },
    //       name: {
    //         type: String,
    //         required: true,
    //       },
    //       rating: {
    //         type: Number,
    //         required: true,
    //       },
    //       comment: {
    //         type: String,
    //         required: true,
    //       },
    //     },
    //   ],

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
// schema.set('strictPopulate', false);

export const Event = mongoose.model("Event",schema);