import {Admin} from "../models/Admin.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"

export const registeradmin = catchAsyncError(async (req, res, next) => {
    const {email, password ,confirmpassword,name} = req.body;
    if (!email || !password||!confirmpassword||!name)
      return next(new ErrorHandler("Please enter all field", 400));
    if(password != confirmpassword)
    return next(new ErrorHandler("password and confirm password not matched"))
    let admin = await Admin.findOne({ email });
    if (admin) return next(new ErrorHandler("Admin Already Exist", 409));
    let AdminAvatar = undefined;
        if(req.file){
            const file = getDataUri(req.file);
             const mycloud = await cloudinary.v2.uploader.upload(file.content);
             AdminAvatar ={
               public_id:mycloud.public_id,
               url:mycloud.secure_url,
             }
           }
    admin = await Admin.create({
      email,
      password,
      confirmpassword,
      name,
      AdminAvatar,
    });

    sendToken(res, admin, "Admin added Successfully", 201);
    

  });


  export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password)
      return next(new ErrorHandler("Please enter all field", 400));
  
    const admin = await Admin.findOne({ email }).select("+password");
  
    if (!admin) return next(new ErrorHandler("Incorrect Email or Password", 401));
  
    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return next(new ErrorHandler("Incorrect Email or Password", 401));
    sendToken(res, admin, `Welcome back, ${admin.email}`, 200);
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
    const admin = await Admin.findById(req.admin._id);
    res.status(200).json({
      success: true,
      admin,
    });
  });

  export const testapi = catchAsyncError(async (req, res, next) => {
    res.status(200).json({
      success: true,
      message:"testapi"
    });
  });

  export const updatePassword = catchAsyncError(async (req, res, next) => {
    const {oldpassword, newpassword,confirmpassword} = req.body;
    if (!oldpassword||!newpassword||!confirmpassword)
      return next(new ErrorHandler("Please enter all field", 400));
    const admin = await Admin.findById(req.admin._id).select("+password");
    const isMatch = await admin.comparePassword(oldpassword);
    if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));
    if (oldpassword==newpassword) return next(new ErrorHandler("oldpassword and newpassword matc", 400));
    if(newpassword!==confirmpassword)return next(new ErrorHandler("newpassword and confirm password is not same"));
    admin.password = newpassword;
    await admin.save();
    res.status(200).json({
      success: true,
      message: "password update Successfully",
    });
  });

  export const updateProfile = catchAsyncError(async (req, res, next) => {
    const {email,name } = req.body;
  
    const admin = await Admin.findById(req.admin._id);

    if (email) admin.email = email;
    if (name) admin.name = name;
  
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
    });
  });

  export const updateadminprofilepicture= catchAsyncError(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);
    if(req.file){
      const file =getDataUri(req.file);
      await cloudinary.v2.uploader.destroy(admin.AdminAvatar.public_id);
      const mycloud = await cloudinary.v2.uploader.upload(file.content);
    admin.AdminAvatar ={
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    }
    }
    await admin.save();
    res.status(200).json({
      success: true,
      message: "admin image Updated Successfully",
    });
    });


  export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;
    const admin = await Admin.findOne({ email });
  
    if (!admin) return next(new ErrorHandler("admin not found", 400));
  
    const resetToken = await admin.getResetToken();
  
    await admin.save();
  
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  
    const message = `Click on the link to reset your password. ${url}. If you have not request then please ignore.`;
  
    // Send token via email
    await sendEmail(admin.email, "CourseBundler Reset Password", message);
  
    res.status(200).json({
      success: true,
      message: `Reset Token has been sent to ${admin.email}`,
    });
  });
  
  export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params;
  
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
  
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });
  
    if (!admin)
      return next(new ErrorHandler("Token is invalid or has been expired", 401));
  
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
  
    await admin.save();
  
    res.status(200).json({
      success: true,
      message: "Password Changed Successfully",
    });
  });
  