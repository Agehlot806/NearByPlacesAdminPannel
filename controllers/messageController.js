import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Message } from "../models/Messages.js";
import { User } from "../models/User.js";
import firebaseadmin from "firebase-admin";
// import serviceAccount from "../nearbyplaces-383512-firebase-adminsdk-wtkbu-f576bce233.json";
// import serviceAccount from "../nearbyplaces-383512-firebase-adminsdk-wtkbu-f576bce233.json" assert { type: "json" };
// firebaseadmin.initializeApp({
//   credential: firebaseadmin.credential.cert(serviceAccount),
// });

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

export const getllmessage = catchAsyncError(async(req,res,next)=>{
  const messages = await Message.find();
  res.status(200).json({
    success:true,
  messages,
  })
})


export const sendpushNotification =catchAsyncError(async(req,res,next)=>{
  const { message } = req.body;

  try {
    // Fetch all registered users from the database
    const users = await User.find();

    // Send push notification to each user
    users.forEach(user => {
      if (user.fcmToken) {
        // Send push notification to Android device using FCM
        const androidMessage = {
          data: {
            message: message,
          },
          token: user.fcmToken,
        };
        admin.messaging().send(androidMessage)
          .then(() => console.log('Notification sent to Android device:', user.fcmToken))
          .catch(error => console.error('Failed to send notification to Android device:', error));
      }

      if (user.apnsToken) {
        // Send push notification to iOS device using APNs
        const iosMessage = {
          notification: {
            title: 'Notification',
            body: message,
          },
          token: user.apnsToken,
        };
        admin.messaging().send(iosMessage)
          .then(() => console.log('Notification sent to iOS device:', user.apnsToken))
          .catch(error => console.error('Failed to send notification to iOS device:', error));
      }

      if (user.webPushSubscription) {
        // Send push notification to web user using Web Push API
        const webPushSubscription = user.webPushSubscription;
        const webMessage = JSON.stringify({
          title: 'Notification',
          body: message,
        });
        admin.messaging().sendMulticast({
          webpush: {
            notification: {
              title: 'Notification',
              body: message,
            },
          },
          tokens: [webPushSubscription],
        })
          .then(() => console.log('Notification sent to web user:', webPushSubscription))
          .catch(error => console.error('Failed to send notification to web user:', error));
      }
    });

    res.send('Notifications sent successfully.');
  } catch (error) {
    console.error('Failed to fetch users or send notifications:', error);
    res.status(500).json({ error: 'Failed to send notifications' });
  }
})