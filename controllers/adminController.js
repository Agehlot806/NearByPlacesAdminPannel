import { User } from "../models/User.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"
// // import csv from  "csv-parser";
// import csv from "csvtojson";
// import {csvParser,Parser} from "json2csv";
// import axios from "axios";
// import csvParser from "csv-parser";

// const csvparser = require("json2csv").Parser

export const registerUser = catchAsyncError(async (req, res, next) => {
    const {email, password ,name} = req.body;
    if (!email || !password||!name)
      return next(new ErrorHandler("Please enter all field", 400));
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("Admin Already Exist", 409));
    let AdminAvatar = undefined;
        if(req.file){
            const file = getDataUri(req.file);
             const mycloud = await cloudinary.v2.uploader.upload(file.content);
             AdminAvatar ={
               public_id:mycloud.public_id,
               url:mycloud.secure_url,
             }
           }
    user = await User.create({
      email,
      password,
      name,
      AdminAvatar,
    });

    sendToken(res, user, "Admin added Successfully", 201);
    

  });


  export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter all field", 400));
  
    const user = await User.findOne({ email }).select("+password");
  
    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));
  
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return next(new ErrorHandler("Incorrect Email or Password", 401));
    sendToken(res, user, `Welcome back, ${user.email}`, 200);
  });
  
  export const logout = catchAsyncError(async (req, res, next) => {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,  
        sameSite: "none",
      })
      .json({
        success: true,
        message: "Logged Out Successfully",
      });
  });

export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      user,
    });
  });

  export const testapi = catchAsyncError(async (req, res, next) => {
    const userId = await User.findById(req.body.userId);
    await userId.save();
    res.status(200).json({
      success:true,

    })
  });

  export const updatePassword = catchAsyncError(async (req, res, next) => {
    const {oldpassword, newpassword} = req.body;
    if (!oldpassword||!newpassword)
      return next(new ErrorHandler("Please enter all field", 400));
    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await user.comparePassword(oldpassword);
    if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));
    if (oldpassword==newpassword) return next(new ErrorHandler("oldpassword and newpassword matc", 400));
    user.password = newpassword;
    await user.save();
    res.status(200).json({
      success: true,
      message: "password update Successfully",
    });
  });

  export const updateProfile = catchAsyncError(async (req, res, next) => {
    const {email,name } = req.body;
  
    const user = await User.findById(req.user._id);

    if (email) user.email = email;
    if (name) user.name = name;
  
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  });

  export const updateadminprofilepicture= catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if(req.file){
      const file =getDataUri(req.file);
      await cloudinary.v2.uploader.destroy(user.AdminAvatar.public_id);
      const mycloud = await cloudinary.v2.uploader.upload(file.content);
    user.AdminAvatar ={
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    }
    }
    await user.save();
    res.status(200).json({
      success: true,
      message: "admin image Updated Successfully",
    });
    });


  export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
  
    if (!user) return next(new ErrorHandler("admin not found", 400));
  
    const resetToken = await user.getResetToken();
  
    await user.save();
  
    const url = `${process.env.FRONTEND_URL}/api/v1/resetpassword/${resetToken}`;
  
    const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;
  
    // Send token via email
    await sendEmail(user.email, "CourseBundler Reset Password", message);
  
    res.status(200).json({
      success: true,
      message: `Reset Token has been sent to ${user.email}`,
    });
  });
  
  export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
  
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });
  
    if (!user)
      return next(new ErrorHandler("Token is invalid or has been expired", 401));
  
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
  
    await user.save();
  
    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  });
  //update user role api || admin and staff controller
  export const updateUserRole = catchAsyncError(async (req, res, next) => {
    const {role}  = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not found", 404));
    if (role) user.role = role;
    await user.save();
    res.status(200).json({
      success: true,
      message: `${user.role}`,
    });
  });


  export const getallusers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
      success: true,
      users,
    });
  });

  export const getDashboardStats = catchAsyncError(async (req, res, next) => {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);
  
    const statsData = [];
  
    for (let i = 0; i < stats.length; i++) {
      statsData.unshift(stats[i]);
    }
    const requiredSize = 12 - stats.length;
  
    for (let i = 0; i < requiredSize; i++) {
      statsData.unshift({
        users: 0,
        subscription: 0,
        views: 0,
      });
    }
  
    const usersCount = statsData[11].users;
    const subscriptionCount = statsData[11].subscription;
    const viewsCount = statsData[11].views;
  
    let usersPercentage = 0,
      viewsPercentage = 0,
      subscriptionPercentage = 0;
    let usersProfit = true,
      viewsProfit = true,
      subscriptionProfit = true;
  
    if (statsData[10].users === 0) usersPercentage = usersCount * 100;
    if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
    if (statsData[10].subscription === 0)
      subscriptionPercentage = subscriptionCount * 100;
    else {
      const difference = {
        users: statsData[11].users - statsData[10].users,
        views: statsData[11].views - statsData[10].views,
        subscription: statsData[11].subscription - statsData[10].subscription,
      };
  
      usersPercentage = (difference.users / statsData[10].users) * 100;
      viewsPercentage = (difference.views / statsData[10].views) * 100;
      subscriptionPercentage =
        (difference.subscription / statsData[10].subscription) * 100;
      if (usersPercentage < 0) usersProfit = false;
      if (viewsPercentage < 0) viewsProfit = false;
      if (subscriptionPercentage < 0) subscriptionProfit = false;
    }
  
    res.status(200).json({
      success: true,
      stats: statsData,
      usersCount,
      subscriptionCount,
      viewsCount,
      subscriptionPercentage,
      viewsPercentage,
      usersPercentage,
      subscriptionProfit,
      viewsProfit,
      usersProfit,
    });
  });
  


  