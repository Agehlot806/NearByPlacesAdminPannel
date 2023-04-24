import { Event } from "../models/Event.js";
import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import ApiFeatures from "../utils/apifeatures.js";

export const AddnewEvent = catchAsyncError(async (req, res, next) => {
    const {eventname,description,datebegin,dateend,phonenumber,website,location,address,status} = req.body;
    const store = await Store.findById(req.body.id);
    if (!eventname||!address||!phonenumber)
      return next(new ErrorHandler("Please enter all field", 400));
    let event = await Event.findOne({eventname});
    if (event) return next(new ErrorHandler("Event Already Exist", 409));
    console.log(store)
    let EventPhoto = undefined;
        if(req.file){
            const file = getDataUri(req.file);
             const mycloud = await cloudinary.v2.uploader.upload(file.content);
             EventPhoto ={
               public_id:mycloud.public_id,
               url:mycloud.secure_url,
             }
           }
    event = await Event.create({
        eventname,description,datebegin,dateend,phonenumber,website,location,address,EventPhoto,status
    });  
    res.status(201).json({
      success:true,
      message:"Evenet created successfully",
      event
    })
  });

  