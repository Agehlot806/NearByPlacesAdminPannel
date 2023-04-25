import { Event } from "../models/Event.js";
import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import ApiFeatures from "../utils/apifeatures.js";
import mongoose from "mongoose";

export const AddnewEvent = catchAsyncError(async (req, res, next) => {
    const {eventname,description,datebegin,dateend,phonenumber,website,location,address,status,storeId} = req.body;
    if (!eventname||!address||!phonenumber)
      return next(new ErrorHandler("Please enter all field", 400));
    // let store = await Store.findById(req.body.id);
    // console.log(store.name);
    let event = await Event.findOne({eventname});
    // event.storename.store.push(store.name)
    if (event) return next(new ErrorHandler("Event Already Exist", 409));
    let EventPhoto = undefined;
        if(req.file){
            const file = getDataUri(req.file);
             const mycloud = await cloudinary.v2.uploader.upload(file.content);
             EventPhoto ={
               public_id:mycloud.public_id,
               url:mycloud.secure_url,
             }
           }
    const eventobj = {
        eventname,description,datebegin,dateend,phonenumber,website,location,address,EventPhoto,status,storeId: new mongoose.Types.ObjectId(storeId)
    }
    const eventNewObject = new Event(eventobj);
   let finalevent = await eventNewObject.save();
//    console.log(finalevent);
   let currevent = await Event.aggregate([
     {
        $match:{_id:new mongoose.Types.ObjectId(finalevent.id)}
     },
     {
        $lookup:{
            from:"stores",
            localField:"storeId",
            foreignField:"_id",
            as:"store"
        }
     }
   ])
//    console.log(currevent);
    res.status(201).json({
      success:true,
      message:"Evenet created successfully",
    //   eventobj
    currevent
    })
  });

  export const GetAllEvents  = catchAsyncError(async (req, res, next) => {
    const resultPerPage =5;
    const EventCounts = await Event.countDocuments();
    const apiFeature = new ApiFeatures(Event.find(),req.query).search().filter().pagination(resultPerPage);
    let events = await apiFeature.query;
    res.status(200).json({
      success: true,
      events,
      EventCounts,
      resultPerPage
    });
  });

  export const getEventById = catchAsyncError(async (req, res, next) => {
    const events = await Event.findById(req.params.id);
    res.status(200).json({
      success: true,
      events    
    });
  });

export const DeleteEventById = catchAsyncError(async (req, res, next) => {
    const events = await Event.findById(req.params.id);
    if (!events) return next(new ErrorHandler("Event not found", 404));
    await cloudinary.v2.uploader.destroy(events.EventPhoto.public_id);
    await cloudinary.v2.uploader.destroy(events.EventPhoto.public_id);
   await events.deleteOne();
    res.status(200).json({
      success: true,
      message: "Event Deleted Successfully",
    });
  });

  export const UpdateEvent = catchAsyncError(async (req, res, next) => {
    const {eventname,description,datebegin,dateend,phonenumber,website,location,address,status,storeId} = req.body;
    const events = await Event.findById(req.params.id);
    if (eventname) events.eventname = eventname;
    if (description) events.description = description;
    if (datebegin) events.datebegin = datebegin;
    if (website) events.website = website;
    if (dateend) events.dateend = dateend;
    if (phonenumber) events.phonenumber = phonenumber;
    if (location) events.location = location;
    if (address) events.address = address;
    if (status) events.status = status;
    if(storeId) events.storeId = storeId;
    await events.save();
    res.status(200).json({
      success: true,
      message: "Events Updated Successfully",
      events
    });
  });


  export const UpdateEventImage= catchAsyncError(async (req, res, next) => {
    const events = await Event.findById(req.params.id);
    if(req.file){
    const file = getDataUri(req.file);
    await cloudinary.v2.uploader.destroy(events.EventPhoto.public_id);
    const mycloud = await cloudinary.v2.uploader.upload(file.content);
    events.EventPhoto ={
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    }
    }
    await events.save();
    res.status(200).json({
      success: true,
      message: " Event Images  Updated Successfully",
    });
  });
  