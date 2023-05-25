import { Event } from "../models/Event.js";
import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import ApiFeatures from "../utils/apifeatures.js";
import mongoose from "mongoose";
import { User } from "../models/User.js";

export const AddnewEvent = catchAsyncError(async (req, res, next) => {
    const {eventname,description,datebegin,dateend,phonenumber,website,location,address,status,storeId,EventType} = req.body;
    if (!eventname||!address||!phonenumber||!EventType)
      return next(new ErrorHandler("Please enter all field", 400));
    let event = await Event.findOne({eventname});
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
        eventname,description,datebegin,dateend,phonenumber,website,location,address,EventPhoto,status,storeId,EventType
    }
    const eventNewObject = new Event(eventobj);
   let finalevent = await eventNewObject.save();
//    console.log(finalevent);
  //  let currevent = await Event.aggregate([
  //    {
  //       $match:{_id:new mongoose.Types.ObjectId(finalevent.id)}
  //    },
  //    {
  //       $lookup:{
  //           from:"stores",
  //           localField:"storeId",
  //           foreignField:"_id",
  //           as:"store"
  //       }
  //    }
  //  ])
//    console.log(currevent);
    res.status(201).json({
      success:true,
      message:"Evenet created successfully",
    //   eventobj
    // currevent
    finalevent
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
  
  export const addparticipantToEvent = catchAsyncError(async(req,res,next)=>{
    const {eventId} = req.body;
    const events = await Event.findById(eventId);
    // console.log(eventId)
    const participant = {
      user:req.user._id,
      name:req.user.name,
      eventname:events.eventname,
      status:events.status,
      datebegin:events.datebegin,
      dateend:events.dateend

    }
    console.log(typeof(participant));
    const isParticipated = events.usersparticipated.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
    if(isParticipated) {
      events.usersparticipated.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          return next(new ErrorHandler("you already participated to the event"));
      });
    } else {
    events.usersparticipated.push(participant)
    }
    await events.save({ validateBeforeSave: false });
    // await events.save()

  res.status(200).json({
    success: true,
  });
  })

  //get all participant for the event
  export const getallEventParticipants = catchAsyncError(async (req, res, next) => {
    const events = await Event.findById(req.query.id);
    if (!events) {
      return next(new ErrorHandler("Event not found", 404));
    }
    // console.log(totalEventparticipant)
    res.status(200).json({
      success: true,
      usersparticipated: events.usersparticipated,
      totalparticipant:events.usersparticipated.length
  
    });
  });

  //delete user from event 
  export const deleteparticipantfromEvent = catchAsyncError(async (req, res, next) => {
    const events = await Event.findById(req.query.eventId);
    if (!events) {
      return next(new ErrorHandler("Events not found", 404));
    }
    const usersparticipated = events.usersparticipated.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    await Event.findByIdAndUpdate(
      req.query.eventId,
      {
        usersparticipated,
        
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({
      success: true,
    });
  });





  