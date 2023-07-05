import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: validator.isEmail,
  },

  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: ["admin","user","merchant"],
    default: "user",
  },
    adminavatar:{
      type:String
    },
    testapidata:{
      type:String
    },

    CreatedAt:{
        type:Date,
        default:Date.now,
    },
    permission:[
        
{
  
}

],
favoriteRestaurants: [
  {
    name: {
      type: String,
      required: true
    },
    storeownername: {
      type: String,
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    },
    phonenumber: {
      type: Number,
      required: true
    },
    website: {
      type: String
    },
    storephoto: {
      type: String
    },
    storegallery: {
      type: String
    },
    numOfReviews: {
      type: Number,
      default: 0
    },
    ratings: {
      type: Number,
      default: 0
    },
    livelocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        // required: true
      },
      formattedAddress: {
        type: String
      },
      country: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      zipcode: {
        type: String
      },
      neighbourhood: {
        type: String
      },
      provider: {
        type: String
      }
    },
    status: {
      type: Boolean,
      default: true
    },
    tables: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Table'
    },
    availableMenu: [
      {
        price: {
          type: Number,
          required: true
        },
        _id: false
      }
    ],
    MenuQR: {
      type: String
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ],
    CreatedAt: {
      type: Date,
      default: Date.now
    }
  }
],
    resetPasswordToken:String,
    resetPasswordExpire:String,
    fcmToken: String,

    // merchant register section 
    phone:Number,
    otp:Number,
    uid:String,
    refreshToken:String,

});

schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
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

schema.methods.getResetToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};


export const User = mongoose.model("User",schema);





