import { User } from "../models/User.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendToken } from "../utils/sendToken.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import { categoryUpload, uploadsingle } from "../middlewares/multer.js";
import deleteFromS3 from "../middlewares/multer.js";
import admin from "firebase-admin";
import { Merchant } from "../models/Merchant.js";
import nodeCron from "node-cron";
import { Store } from "../models/Stores.js";
import { Otp } from "../models/otp.js";
import { Offer } from "../models/Offer.js";
import ApiFeatures from "../utils/apifeatures.js";

nodeCron.schedule("*/59 * * * *", function () {
  SendNotification();
});

// import serviceAccount from '../book-my-place-tarun-firebase-adminsdk-hnvjf-04ae09427e.json' assert { type: 'json' };
const serviceAccount = {
  type: "service_account",
  project_id: "book-my-place-tarun",
  private_key_id: "04ae09427e9430f6a02d09258012beccfb9c39d9",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDbr7UmhzCQz0KZ\nYaLNDzRNwKrImjPsEg4Tm3HiwrCSF/FPhMnW3+0sBZf2IdczvdhkqZDXv1nXQeZh\n44wAKH+nzh75sXi8bQ2fp2H0IMx8bxFtrzcamj+l0EQ/9wq+ftu4LgW5Sgw3md6M\nUQZwko+zxhTLnTIPG5814TYuxH2ZOKkp5uwr4STMwMPMLmcOz4WTsXG+f29uQKq+\nsRFOPAMBeLtQL+O1x/vU+wc24g5tu4VuBwOJpLvqdlBEIPOzaG6w3owFFGfka6fe\nL/Qtz8CHkszZIvd9TJwF0eAX9H5/T+71tob/2KseXAsAmSZQyB+NmYD/QaWDp3KH\nPBT4EAXbAgMBAAECggEAVTjW5dDY8rwsYlMBdFobGLSOrA5B6Sjh5BJPvj93ft0h\n5A6nvB8XIxYyaq2bDbvuZ7Jt+XwGLp6mcD/1DhSn3OF1m7iQlUwa1l34/lsA6J6v\nnKS1lDDVUw41g7jipp6QvuS/nK8QiTs8HaPLAz2f2IYViB19j2XQP/cTbVYVQSwF\nTqH2BTBV91762ZLddOfqucbm2uo+wYg3HmbPqrrDZeEbhDKXtg7G9yxuuKcKSh4Y\n8cCM/7bLwxbrQBg8xsurOb5f0qedxWsfXgyJ3iHjSCLBauUzuucB3NW/lp2v+uPP\nwx6dXt7Id8Z2QqDq+wqppLgHjHA7tZ0JtHqImD0F9QKBgQDyJvadG9Tp7Xe8gNTj\nak71dbk7lZu/04IjVjlomaLiVSSRDtUTCUPfK++XLdWLWGPa/ebDIzTbbVMsaNnu\nkl7c3gBx9/Yw8btugKTWWsjLa9liiv3WEH7fdu61Wmvn7U710v17IzSnojqJZx0L\nVgQCWKh5vVnRgd6eQMPHNaDB1QKBgQDoP9naPFg46/QBTW/ZEFZBRDjXQJEPQEp4\n5uJ8Hh3JNW3QHFk4VQICfYpvLG4hctpxGWNU36ehrUmU6njpCPeLjm4DZ6H4APFV\ny3ErHokD1vHYAUyNFMoaloiy8NWg3Em9BE8zoZePMpMPDILUpmsIdwkU3dkQnID0\nml2whIbQ7wKBgQCWVJYZpyOhLml9P0XrAR6PyEv8r76HclmCco8lXuv+MvmGjHy/\nWqsmK3KMmknOPkuPsrzGPF8eMlrGYTmaoIf/+lqwZk4SyJ+h1H+BC89IamYEhWFc\nudTqCj3bnI0M6QhyGFCBV7PithY9IySm2vmWM1A0c9cE9+kque5RB/wLGQKBgFfb\nj7YXDei6mdvER4N9wqN+A2KqcjWqxIFoFlWNrwbmx1vq3XWJ8vCuPShBTogowqn2\nSLVaxjdLLoK/EG5Xjg2lG8j98y+2a5VhGLaPHpXtQh/MngDg1HOqbpwCr03jB6IR\nd0S45HSvVSJkQTngmqzhGvZh1jOKgN4HZ1nXSIjRAoGAS2cw6DZ7Eie/WvY4bVp+\nCeFfWX6723AB2R93M4FD6QOxPIReD8fzQ0CqemAcKzKaAPFu18zGmH7X9KDVjJmQ\nzWdRTPbWAaTr7zvO6tkDjf4UC2BsJdyKz/usGm5f+ZRiEDpd8lJDcxN2s/k4k/IV\nLe9IrCi3wVL19x/vkRqzlbM=\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-hnvjf@book-my-place-tarun.iam.gserviceaccount.com",
  client_id: "108450056524686082539",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-hnvjf%40book-my-place-tarun.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const SendNotification = catchAsyncError(async (req, res, next) => {
  try {
    const tokens = await fetchTokensFromDatabase();

    const messages = tokens.map((token) => ({
      notification: {
        title: "New Notification",
        body: "This is a notification from your app!",
      },
      token: token,
    }));

    const response = await admin.messaging().sendAll(messages);

    console.log("Notification sent:", response);

    const errors = [];
    if (Array.isArray(response)) {
      response.forEach((result, index) => {
        if (!result.success) {
          const error = result.error;
          errors.push({ index, error });
        }
      });
    } else {
      console.log("Unexpected response:", response);
      // Handle the unexpected response accordingly
    }

    console.log("Notification errors:", errors);

    // res.status(200).json({
    //   success: true,
    //   message: "Notification sent successfully",
    // });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return res.status(500).json({
      success: false,
      message: "Notification failed",
    });
  }
});

async function fetchTokensFromDatabase() {
  try {
    const users = await User.find({}, "fcmToken");
    console.log(users);
    const tokens = users.map((user) => user.fcmToken);
    return tokens;
  } catch (error) {
    console.error("Error fetching tokens from database:", error);
    throw error;
  }
}

export const merchantRegister = catchAsyncError(async (req, res, next) => {
  try {
    const { phonenumber, uid, refreshToken } = req.body;
    const merchant = new Merchant({
      phonenumber,
      refreshToken,
      uid,
    });

    await merchant.save();
    res.status(201).json({
      success: true,
      message: "merchant added successfully",
      merchant,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// export const login = catchAsyncError(async (req, res, next) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return next(new ErrorHandler("Please enter all field", 400));

//   const user = await User.findOne({ email }).select("+password");

//   if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

//   const isMatch = await user.comparePassword(password);
//   if (!isMatch)
//     return next(new ErrorHandler("Incorrect Email or Password", 401));
//   sendToken(res, user, `Welcome back, ${user.email}`, 200);
// });

export const PhoneOtp_Login = catchAsyncError(async (req, res, next) => {
  const { phone } = req.body;

  try {
    // Check if the user with the given phone number exists in the OTP model
    let otpUser = await Otp.findOne({ phone });

    if (otpUser) {
      // Find the corresponding user in the User model using otpId
      let user = await User.findOne({ otpId: otpUser._id });

      if (user) {
        // Both phone and otpId found in both models
        return res.json({
          message: "User already registered, otp generated successfully!",
          isNewUser: false,
          userId: otpUser._id,
        });
      } else {
        // Phone found in the OTP model but corresponding User not found
        return res.json({
          message: "OTP sent for login, User not fully registered yet.",
          isNewUser: true,
          userId: otpUser._id,
        });
      }
    } else {
      // User does not exist in the OTP model
      // Generate and save a dummy OTP (replace this with actual OTP generation and sending logic)
      const dummyOTP = "1234"; // Replace with actual OTP generation
      otpUser = new Otp({ phone, otp: dummyOTP });
      await otpUser.save();

      return res.json({
        message: "User registered successfully, otp generated successfully!",
        isNewUser: true,
        userId: otpUser._id,
      });
    }
  } catch (error) {
    console.error("Error while registering/logging in user:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export const verify_Login = catchAsyncError(async (req, res, next) => {
  const { otp, id } = req.body;

  try {
    // Find the OTP model with the provided ID
    const otpModel = await Otp.findById(id);

    if (!otpModel) {
      // OTP model with the provided ID not found
      return res.status(404).json({ error: "OTP model not found" });
    }

    // Compare the OTP from the model with the input OTP
    if (otpModel.otp !== otp) {
      // OTP does not match
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Clear the OTP and save the OTP model
    // otpModel.otp = undefined;
    await otpModel.save();

    // Fetch the user details based on otpId
    const user = await User.findOne({ otpId: id });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user details along with the response indicating successful OTP verification
    return res.json({ message: "OTP verified successfully", user });
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});


export const PhoneOtp_Register = catchAsyncError(async (req, res, next) => {
  const { phone } = req.body;

  try {
    // Check if the user with the given phone number exists in the OTP model
    let otpUser = await Otp.findOne({ phone });

    if (otpUser) {
      // Find the corresponding user in the User model using otpId
      let user = await User.findOne({ otpId: otpUser._id });

      if (user) {
        // Both phone and otpId found in both models
        return res.json({
          // message: "User already registered, otp generated successfully!",
          Registered: true,
        });
      } else {
        // Phone found in the OTP model but corresponding User not found
        return res.json({
          // message: "User not registered yet.",
          Registered: false,
          userId: otpUser._id,
        });
      }
    } else {
      // User does not exist in the OTP model
      // Generate and save a dummy OTP (replace this with actual OTP generation and sending logic)
      const dummyOTP = "1234"; // Replace with actual OTP generation
      otpUser = new Otp({ phone, otp: dummyOTP });
      await otpUser.save();

      return res.json({
        // message: "User registered successfully, otp generated successfully!",
        // isNewUser : true,
        Registered: false,
        userId: otpUser._id,
      });
    }
  } catch (error) {
    console.error("Error while registering/logging in user:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

export const verify_Register = catchAsyncError(async (req, res, next) => {
  const { otp, id } = req.body;

  try {
    // Find the OTP model with the provided ID
    const otpModel = await Otp.findById(id);

    if (!otpModel) {
      // OTP model with the provided ID not found
      return res
        .status(404)
        .json({ success: false, error: "OTP model not found" });
    }

    // Compare the OTP from the model with the input OTP
    if (otpModel.otp !== otp) {
      // OTP does not match
      return res.status(400).json({ success: false, error: "Invalid OTP" });
    }

    // Clear the OTP and save the OTP model
    // otpModel.otp = undefined;
    await otpModel.save();

    // Fetch the user details based on otpId
    const user = await User.findOne({ otpId: id });

    if (!user) {
      return res
        .status(200)
        .json({
          success: true,
          message: "User Not registered, OTP verified successfully",
          otpModel,
        });
    }

    // Return the user details along with the response indicating successful OTP verification
    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User Already Registered", user });
    }
  } catch (error) {
    console.error("Error while verifying OTP:", error);
    return res
      .status(500)
      .json({ success: false, error: "Something went wrong" });
  }
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
  sendToken(res, user, `Welcome back TO, ${user.email}`, 200);
});

export const registerAdmin = catchAsyncError(async (req, res, next) => {
  uploadsingle(req, res, async (err) => {
    if (err)
      return next(new ErrorHandler("failed to upload image try again later"));
    const { name, email, password } = req.body;
    const fcmToken = req.body.fcmToken;
    if (!name || !email || !password || !fcmToken)
      return next(new ErrorHandler("Please enter all field", 400));
    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("Admin Already Exist", 409));
    const adminavatarvalue = req.file.location;
    user = await User.create({
      name,
      email,
      password,
      adminavatar: adminavatarvalue,
      fcmToken,
    });

    await user.save();

    sendToken(res, user, `${user.role} added Successfully`, 201);
  });
});

export const registerUser = catchAsyncError(async (req, res, next) => {
  uploadsingle(req, res, async (err) => {
    if (err)
      return next(
        new ErrorHandler("Failed to upload image, please try again later")
      );

    const otpId = req.params.otpId; 
    const { name, email, phone, address, latitude, longitude } =
      req.body;

    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !latitude ||
      !longitude
    )
      return next(new ErrorHandler("Please enter all required fields", 400));

    try {
      // Check if the otpId exists in the Otp model
      const otpUser = await Otp.findById(otpId);
      if (!otpUser) {
        return next(new ErrorHandler("Invalid otpId provided", 400));
      }

      // Check if the email is already used
      let user = await User.findOne({ email });
      if (user) {
        return next(
          new ErrorHandler("User with this email already exists", 409)
        );
      }

      // Check if the name is already used
      user = await User.findOne({ otpId });
      if (user) {
        return next(
          new ErrorHandler("User with this otpId already exists", 409)
        );
      }
      user = await User.findOne({ phone });
      if (user) {
        return next(
          new ErrorHandler("User with this phone already exists", 409)
        );
      }

      // Check if the combination of name, email, and otpId exists
      user = await User.findOne({ phone, email, otpId });
      if (user) {
        return next(
          new ErrorHandler(
            "User with the same name, email, and otpId already exists",
            409
          )
        );
      }

      const adminavatarvalue = req.file.location;

      // Create and save the new user document
      user = await User.create({
        name,
        phone,
        email,
        address,
        adminavatar: adminavatarvalue,
        latitude,
        longitude,
        otpId: otpUser._id, // Assign the otpId to the User document
      });

      sendToken(res, user, `${user.role} added successfully`, 201);
    } catch (error) {
      console.error("Error while registering user:", error);
      return next(new ErrorHandler("Something went wrong", 500));
    }
  });
});

export const editAdminAvatar = catchAsyncError(async (req, res, next) => {
  const userId = req.params.userId; // Assuming you have a route parameter for user ID
  uploadsingle(req, res, async (err) => {
    if (err)
      return next(
        new ErrorHandler("Failed to upload image, please try again later")
      );

    try {
      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
        return next(new ErrorHandler("User not found", 404));
      }

      // Update the adminavatar field
      const adminavatarvalue = req.file.location;
      user.adminavatar = adminavatarvalue;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Admin avatar updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error while updating admin avatar:", error);
      return next(new ErrorHandler("Something went wrong", 500));
    }
  });
});

export const editUserProfile = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, address, latitude, longitude } = req.body;
    if (req.file) {
      user.adminavatar = req.file.filename;
    }
      const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Update the editable fields if they're provided in the request body
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (address !== undefined) user.address = address;
    if (latitude !== undefined) user.latitude = latitude;
    if (longitude !== undefined) user.longitude = longitude;

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        address: user.address,
        latitude: user.latitude,
        longitude: user.longitude,
        adminavatar: user.adminavatar,
      },
    });
  } catch (error) {
    console.error("Error while editing user profile:", error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
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
      message: `Logged Out Successfully`,
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const getUserDetailsByOtpId = catchAsyncError(async (req, res, next) => {
  const otpId = req.params.otpId; // Get the otpId from the URL parameter

  try {
    // Find the user by their otpId field
    const user = await User.findOne({ otpId });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error while fetching user details:", error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const testapi = catchAsyncError(async (req, res, next) => {
  const userId = await User.findById(req.body.userId);
  await userId.save();
  res.status(200).json({
    success: true,
  });
});

export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { oldpassword, newpassword } = req.body;
  console.log("111");
  if (!oldpassword || !newpassword)
    return next(new ErrorHandler("Please enter all field", 400));
  const user = await User.findById(req.user._id).select("+password");
  const isMatch = await user.comparePassword(oldpassword);
  if (!isMatch) return next(new ErrorHandler("Incorrect Old Password", 400));
  if (oldpassword == newpassword)
    return next(new ErrorHandler("oldpassword and newpassword matc", 400));
  user.password = newpassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: `${user.name} , password update Successfully`,
  });
});

export const updateProfile = catchAsyncError(async (req, res, next) => {
  const userId = req.params.id;
  uploadsingle(req, res, async (err) => {
    if (err) return next(new ErrorHandler("failed to update image"));
    const { name, email } = req.body;
    const updates = {};
    if (name) {
      updates.name = name;
    }
    if (email) {
      updates.email = email;
    }
    if (req.file) {
      const photoUrlValue = req.file.location;
      updates.adminavatar = photoUrlValue;
    }
    try {
      const user = await User.findById(userId);
      if (!user) return next(new ErrorHandler("user not found"));
      if (updates.adminavatar && user.adminavatar) {
        await deleteFromS3(user.adminavatar);
      }
      Object.assign(user, updates);
      await user.save();
      res.status(200).json({
        success: true,
        message: "profile update successfully",
        user,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "failed to update profile",
        error: err.message,
      });
    }
  });
});

export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });

  if (!user) return next(new ErrorHandler("admin not found", 400));

  const resetToken = await user.getResetToken();

  await user.save({validateBeforeSave:false});

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
  const { role } = req.body;
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
export const getsingleusers = catchAsyncError(async (req, res, next) => {
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
      merchant: 0,
      offer: 0,
      events: 0,
    });
  }

  const usersCount = statsData[11].users;
  const merchantCount = statsData[11].merchant;
  const offerCount = statsData[11].offer;
  const eventCount = statsData[11].events;

  let usersPercentage = 0,
    merchantPercentage = 0,
    offerPercentage = 0,
    eventPercentage = 0;

  let usersProfit = true,
    merchantProfit = true,
    offerProfit = true,
    eventProfit = true;

  if (statsData[10].users === 0) usersPercentage = usersCount * 100;
  if (statsData[10].merchant === 0) merchantPercentage = merchantCount * 100;
  if (statsData[10].offer === 0) offerPercentage = offerCount * 100;
  if (statsData[10].events === 0) eventPercentage = eventCount * 100;
  else {
    const difference = {
      users: statsData[11].users - statsData[10].users,
      merchant: statsData[11].merchant - statsData[10].merchant,
      offer: statsData[11].offer - statsData[10].offer,
      events: statsData[11].events - statsData[10].events,
    };

    usersPercentage = (difference.users / statsData[10].users) * 100;
    merchantPercentage = (difference.merchant / statsData[10].merchant) * 100;
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

// export const sendEmailtoAll = catchAsyncError(async (req, res, next) => {
//   const users = await User.find({}, 'email');
//   const url = process.env.FRONTEND_URL;
//   const message = `Click on the link to reset your password: ${url}. If you have not requested this, please ignore.`;

//   const emailPromises = users.map(user => sendEmail(user.email, 'Notification for all', message));

//   await Promise.all(emailPromises);

//   res.status(200).json({
//     success: true,
//     message: 'Emails sent successfully',
//   });
// });

export const sendEmailtoAll = catchAsyncError(async (req, res, next) => {
  try {
    const { recipients, title, body } = req.body; // Assuming recipients, title, and body are sent in the request body

    let roleQuery = {}; // Empty object to hold the role query

    // Check the selected recipients and create the role query accordingly
    if (recipients === "user") {
      roleQuery = { role: "user" };
    } else if (recipients === "admin") {
      roleQuery = { role: "admin" };
    } else if (recipients === "all") {
      roleQuery = { role: { $in: ["user", "admin"] } };
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid recipient selection",
      });
    }

    const users = await User.find(roleQuery, "email"); // Retrieve users based on the role query

    const emailPromises = users.map(async (user) => {
      await sendEmail(user.email, title, body); // Use the provided title and body for each email
    });

    await Promise.all(emailPromises);

    res.status(200).json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).json({ success: false, message: "Failed to send emails" });
  }
});

const sendEmailtoAllusrswithcronjob = async () => {
  try {
    const recipients = "all"; // Specify the desired recipients ('user', 'admin', or 'all')
    const title = "Notification Title";
    const body = "Notification Body";

    let roleQuery = {};

    if (recipients === "user") {
      roleQuery = { role: "user" };
    } else if (recipients === "admin") {
      roleQuery = { role: "admin" };
    } else if (recipients === "all") {
      roleQuery = { role: { $in: ["user", "admin"] } };
    } else {
      throw new Error("Invalid recipient selection");
    }

    // Retrieve users based on the role query
    const users = await User.find(roleQuery, "email");
    console.log(users);

    const emailPromises = users.map(async (user) => {
      await sendEmail(user.email, title, body);
    });

    await Promise.all(emailPromises);

    console.log("Emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};

//user favariate resturent Apissss

// Assuming you have required dependencies and set up the necessary routes and middleware

// POST /api/favorites

export const getUserfavoriateResturent = catchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id;
    const restaurantId = req.body.restaurantId;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isRestaurantInFavorites = user.favoriteRestaurants.some(
      (rest) => rest._id && rest._id.toString() === restaurantId
    );
    if (isRestaurantInFavorites) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already in favorites list",
      });
    }

    const restaurant = await Store.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    user.favoriteRestaurants.push(restaurant);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Restaurant added to favorites list" });
  }
);

export const removeUserFavoriteRestaurant = catchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id;
    const restaurantId = req.body.restaurantId;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const favoriteRestaurantIndex = user.favoriteRestaurants.findIndex(
      (rest) => rest._id && rest._id.toString() === restaurantId
    );
    if (favoriteRestaurantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found in favorites list",
      });
    }

    user.favoriteRestaurants.splice(favoriteRestaurantIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Restaurant removed from favorites list",
    });
  }
);

export const Banner = catchAsyncError(async (req, res, next) => {
  try {
    const resultPerPage = 5;
    const offerCount = await Offer.countDocuments();
    const apiFeature = new ApiFeatures(Offer.find(), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const offers = await apiFeature.query;

    res.status(200).json({
      success: true,
      offers,
      offerCount,
      resultPerPage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching offers.",
    });
  }
});

export const countUserLikedRestaurants = catchAsyncError(
  async (req, res, next) => {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const totalLikes = user.favoriteRestaurants.length;

    res.status(200).json({ success: true, totalLikes });
  }
);
// Schedule the cronjob to execute sendEmailtoAll function every minute
nodeCron.schedule("*/59 * * * *", sendEmailtoAllusrswithcronjob);
