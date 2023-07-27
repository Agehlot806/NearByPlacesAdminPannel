import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderName: String,
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipientName: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  replies: [
    
    {
      sender:{ 
      
      type: mongoose.Schema.Types.ObjectId, ref: 'Message'
    
    
    },
    senderName:{
      type:String,
    },
    content:{
      type:String
    }

  }
  
  
  ]
});


export const Message  = mongoose.model("Message",messageSchema);