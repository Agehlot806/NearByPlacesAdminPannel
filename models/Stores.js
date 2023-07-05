// import mongoose, { mongo } from "mongoose";
// const schema = new mongoose.Schema({
//     name:{
//         type:String,
//         required:true,
//     },
//     storeownername:{
//       type:String,
//       required:true
//     },
//     category:{
//       type:mongoose.Schema.Types.ObjectId,
//       ref:"Category",
//       required:true,
//     },
//     phonenumber:{
//         type:Number,
//         required:[true,"Please enter your phonenumber"],
//         unique:true,
//     },
//     website:{
//         type:String,
//         required:true,
//     },
//     details:{
//         type:String,
//     },
//     videourl:{
//         type:String,
//     },

//     storephoto:{
//       type:String,
//     },
//     storegallery:{
//       type:String
//     },
//     numOfReviews: {
//         type: Number,
//         default: 0,
//       },

//       ratings: {
//         type: Number,
//         default: 0,
//       },
//       reviews: [
//         {
//           user: {
//             type:mongoose.Schema.ObjectId,
//             ref: "User",
//             required: true,
//           },
//           name: {
//             type: String,
//             required: true,
//           },
//           rating: {
//             type: Number,
//             required: true,
//           },
//           comment: {
//             type: String,
//             required: true,
//           },
//           image:{
//             type:String,
//             required:true,
//           }
//         },
//       ],

//     livelocation:[{
      
//     }],

//     address:{
//         type:String,
//     },
//     status:{
//       type:Boolean,
//       default:true,
  
//     },
//     CreatedAt:{
//         type:Date,
//         default:Date.now,
//     },
//     tables:{
//       type:[String]
//     },
//     tablebookinguser:[
//         {
//           user:{
//             type:mongoose.Schema.Types.ObjectId,
//             ref:"User",
//             required:true,
//           },
//           name:{
//             type:String,
//           },
//           email:{
//             type:String,
  
//           },
//           phonenumber:{
//             type:String,
//           },
//           tablenumber:{
//             type:String,
//           }
  
//         }
//       ],
//       subscriptionPlanData:[
//      { 
      
//         subscriptionplanId:{
//           type:mongoose.Schema.Types.ObjectId,
//           ref:"Subscription"
//         },
//         subscriptionPrice:{
//           type:Number,
//         },
//         subscriptionDetails:{
//           type:String
//         },
//         subscriptionImage:{
//           type:String
//         },
//         subscriptionName:{
//           type:String,
//         },
//         validityDays:{
//           type:Date,
//         }
       
      
      
//       }
      

//     ]
      
    
// });

// // schema.set('strictPopulate', false);

// export const Store = mongoose.model("Store",schema);



import mongoose from "mongoose";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  storeownername: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  phonenumber: {
    type: Number,
    required: [true, "Please enter your phonenumber"],
    unique: true,
  },
  website: {
    type: String,
    required: true,
  },
  details: {
    type: String,
  },
  videourl: {
    type: String,
  },
  storephoto: {
    type: String,
  },
  storegallery: {
    type: String
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      }
    },
  ],
  livelocation2: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
    livelocation: [{
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    formattedAddress: {
      type: String
    },
    country: {
      type: String
    },
    city: {
      type: String
    },
    state: {
      type: String
    },
    zipcode: {
      type: String
    },
    streetName: {
      type: String
    },
    neighbourhood: {
      type: String
    },
    provider: {
      type: String
    }
  }],
  

  address: {
    type: String,
  },
  status: {
    type: Boolean,
    default: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
  tables: {
    type: [String]
  },
  tablebookinguser: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phonenumber: {
        type: String,
      },
      tablenumber: {
        type: String,
      }
    }
  ],
  subscriptionPlanData: [
    {
      subscriptionplanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subscription"
      },
      subscriptionPrice: {
        type: Number,
      },
      subscriptionDetails: {
        type: String
      },
      subscriptionImage: {
        type: String
      },
      subscriptionName: {
        type: String,
      },
      validityDays: {
        type: Date,
      }
    }
  ],
  availableMenu:[
    {
      items:{
          type:String,
       },
       price:{
        type:Number,
       }
  }
  ],
  MenuQR:{
    type:String
  }
});
schema.index({ livelocation2: "2dsphere" });
schema.set('strictPopulate', false);

export const Store = mongoose.model("Store", schema);