
import mongoose from "mongoose";

const schema = new mongoose.Schema({

cname:{
    type:String,
    required:true
},
phone:{
    type:String,
    required:true
},
address:{
    type:String,
    required:true
},
chefId:{
    type:String,
    required:true
},
storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Store",
    required: true,
  },
//   storefield:{
//     type:[],
//   },
  chefspec:[
    {
    dishname:{
        type:String
    },
    dishprice:{
        type:Number
    },
    dishtype:{
        type:String
    }

}
  ]
})
export const Chefinstore = mongoose.model("Chefinstore",schema)