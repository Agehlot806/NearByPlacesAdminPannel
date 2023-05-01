import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
// import { User } from "../models/User.js";
import { Messages } from "../models/messages.js";

export const sendMessage = catchAsyncError(async(req,res,next)=> {
    const usermessage = {
        user:req.user._id,
        username:req.user.name,
        message:req.body.message
      }
    //   console.log(usermessage)
    let msg = await Messages.findOne({});
    console.log(msg)
    if(msg) return next(new ErrorHandler("you have already raise a message"))
   
      const newobj = new Messages(usermessage)
      await newobj.save({ validateBeforeSave: false });
      // await events.save()
  
    res.status(200).json({
      success: true,
      msg,
    });

})

export const getallmessages = catchAsyncError(async(req,res,next)=>{
    const msg = await Messages.find({});
    res.status(200).json({
        success:true,
        msg
    })
})