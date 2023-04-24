import mongoose from "mongoose";
const schema = new mongoose.Schema({


  name:{
    type:String
  },
    description:{
        type:String,
        // required:true,
    },
    offerImage:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    },
  PricingOfferValue:{
    type:String,
    required:true,
  },
  // couponConfig:[
  //   {
  //       coupon_type:{
  //           type:String,
  //       },
  //       value:{
  //           type:Number
  //       },
  //       coupon_code:{
  //           type:String,
  //       }
  //   }
  // ],

  coupon_type:{
    type:String,
  },
  value:{
          type:Number
         },
         coupon_code:{
               type:String,
        },
  makeAdeal:[
    {
      datebegin:{
        type:Date,
        default:Date.now,
      },
      dateend:{
        type:Date,
        default:Date.now,
      }
    }
  ],
    CreatedAt:{
        type:Date,
        default:Date.now,
    },
});



export const Offer = mongoose.model("Offer",schema);