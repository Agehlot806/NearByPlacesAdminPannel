import jwt from "jsonwebtoken";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "./catchAsyncError.js";
import { Admin } from "../models/Admin.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) return next(new ErrorHandler("Not Logged In", 401));
  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    req.admin = await Admin.findById(decoded._id);

    next();
  });

  export const authorizeAdmin = (req, res, next) => {
    if (req.admin.role !== "admin")
      return next(
        new ErrorHandler(
          `${req.admin.role} is not allowed to access this resource`,
          403
        )
      );
  
    next();
  };