import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Message } from "../models/Messages.js";
import { User } from "../models/User.js";
export const sendMessage = catchAsyncError(async(req,res,next)=> {
  const { sender, recipient, content } = req.body;

  // Check if the sender and recipient are valid users
  const senderUser = await User.findById(sender);
  const recipientUser = await User.findById(recipient);

  if (!senderUser || !recipientUser) {
    return next(new ErrorHandler("cannot fin sender and receiver"));
  }

  const message = new Message({
    sender,
    senderName: senderUser.name,
    recipient,
    recipientName: recipientUser.name,
    content
  });
  console.log(message);
  await message.save();
  res.status(201).json({
    success:true,
    message:"message sent successfully",
    senderUser,
    recipientUser,
    content
  })

})
export const replyingMessage = catchAsyncError(async(req,res,next)=>{
  const { id } = req.params;
  const { sender, content } = req.body;
  // console.log(id,sender,content)
  // Check if the sender is a valid user
  const senderUser = await User.findById(sender);
  if (!senderUser) {
    return next(new ErrorHandler("sender user not found"));
  }

  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("message not found"));
  }

  const reply = {
    sender,
    senderName: senderUser.name,
    content
  };
  console.log(reply)
message.replies.push(reply)
  await message.save();


  res.status(201).json({
    success:true,
    message:"message replied successfull",
    message
  })
})