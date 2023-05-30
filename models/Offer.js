import mongoose from "mongoose";
const schema = new mongoose.Schema({
  offerstore:{
    type:String,
  },
 offername:{
  type:String,
  required:true,
 },
    description:{
        type:String,
    },
    offerimage:{
       type:String
    },
  PricingOfferValue:{
  type:String,
  enum:["Price","Percent"],
  },
  priceUsd: {
    type: Number
  },
  percent: {
    type: Number
  },
  
  coupon_type:{
    type:String,
  },
  value:{
          type:Number,
          required:true,
         },
         coupon_code:{
               type:String,

        },

      datebegin:{
        type:Date,
        default:Date.now,
      },
      dateend:{
        type:Date,
        default:Date.now,
      },
      status:{
        type:Boolean,
        default:true
      },
    CreatedAt:{
        type:Date,
        default:Date.now,
    },
});



export const Offer = mongoose.model("Offer",schema);