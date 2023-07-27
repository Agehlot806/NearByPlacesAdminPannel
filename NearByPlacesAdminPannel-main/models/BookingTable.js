import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {

    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxPeople: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    table_no: {
      type: Number,
      required: true,
    },
     location:
    {
    type:  [String],
    // required: true
  },

  cancellation_charges:{
    type:Number,
    default:0,
  },
  tableStatus:{
    type:String,
    default:"Available"
  },
  
  },
  { timestamps: true }
);
export const Tables = mongoose.model("Tables", schema);