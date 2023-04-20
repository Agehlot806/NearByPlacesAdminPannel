import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
const schema = new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:[true,"Please enter your email"],
        unique:true,
        validate:validator.isEmail,
    },
    password:{
        type:String,
        required:[true,"Please enter you password"],
        minlength:[6,"Password must be atleast 6 character"],
        select:false
    },
    confirmpassword:{
        type:String,
        required:true,
        minlength:[6,"Password must be atleast 6 character"],
        select:false
    },
    role: {
        type: String,
        // enum: ["admin", "user"],
        default: "user",
      },

    AdminAvatar:{
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true
        }
    },

    CreatedAt:{
        type:Date,
        default:Date.now,
    },
    resetPasswordToken:String,
    resetPasswordExpire:String
});

schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  schema.pre("save", async function (next) {
    if (!this.isModified("confirmpassword")) return next();
    this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10);
    next();
  });
  
  schema.methods.getJWTToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });
  };

  schema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

//   schema.methods.comparePassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
//   };

  schema.methods.getResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };

export const Admin = mongoose.model("Admin",schema);