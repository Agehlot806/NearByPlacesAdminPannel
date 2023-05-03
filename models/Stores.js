import mongoose, { mongo } from "mongoose";
const schema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    phonenumber:{
        type:Number,
        required:[true,"Please enter your phonenumber"],
        unique:true,
    },
    website:{
        type:String,
        required:true,
    },
    details:{
        type:String,
    },
    videourl:{
        type:String,
    },

    storephoto:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
    },
    storegallery:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true,
        }
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
            type:mongoose.Schema.ObjectId,
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
        },
      ],
   
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address:{
        type:String,
    },
    status:{
      type:Boolean,
      default:true,
  
    },
    CreatedAt:{
        type:Date,
        default:Date.now,
    },
    tables:{
      type:[String]
    },
    tablebookinguser:[
        {
          user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
          },
          name:{
            type:String,
          },
          email:{
            type:String,
  
          },
          phonenumber:{
            type:String,
          },
          tablenumber:{
            type:String,
          }
  
        }
      ],
      
    
});

// schema.set('strictPopulate', false);

export const Store = mongoose.model("Store",schema);