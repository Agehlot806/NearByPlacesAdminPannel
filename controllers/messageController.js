import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Message } from "../models/Messages.js";
export const sendMessage = catchAsyncError(async(req,res,next)=> {
  let msg = await Message.find()
  // if(msg) return next(new ErrorHandler("you have already request a message"))
    const usermessage = {
        user:req.user._id,
        username:req.user.name,
        message:req.body.message
      }
      console.log(usermessage)

    msg = await Message.create(usermessage)
  
    res.status(200).json({
      success: true,
      msg,
    });

})

export const getallmessages = catchAsyncError(async(req,res,next)=>{
    const msg = await Message.find({});
    res.status(200).json({
        success:true,
        msg
    })
})