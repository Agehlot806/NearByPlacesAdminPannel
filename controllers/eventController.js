import { Event } from "../models/Event.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import deleteFromS3, { eventuplaod } from "../middlewares/multer.js";

export const AddnewEvent = catchAsyncError(async (req, res, next) => {
  eventuplaod(req,res,async(err)=>{
    if(err)
    return next(new ErrorHandler("failed to upload event image try again later"));
    const {eventname,description,datebegin,dateend,phonenumber,website,location,address,status,storeId,EventType} = req.body;
    if(!eventname||!address||!phonenumber||!EventType)
    return next(new ErrorHandler("please add all fields",400))
    let event = await Event.findOne({eventname});
    if(event)
    return next(new ErrorHandler("Event already Exists",409));
    const eventimagevalue = req.file.location;
    event = await Event.create({
      eventname,description,datebegin,dateend,phonenumber,website,location,address,status,storeId,EventType,eventimage:eventimagevalue
    })
    res.status(201).json({
      success:true,
      message:"event created successfully",
      event
    })
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
    const eventId = req.params.id; 
    try {
      const event = await Event.findById(eventId);
  
      if (!event) {
        return next(new ErrorHandler("Event not found", 404));
      }
      await event.deleteOne();
      res.status(200).json({
        success: true,
        message: "Event Deleted Successfully",
      });
    } catch (error) {
      next(new ErrorHandler("Failed to delete event", 500));
    }
  });

  

  export const UpdateEvent = catchAsyncError(async (req, res, next) => {
    const eventId = req.params.id;
    eventuplaod(req,res,async(err)=>{
      if (err)
        return next(new ErrorHandler("failed to update image"));
        const {eventname,description,datebegin,dateend,phonenumber,website,location,address,status,storeId} = req.body;
        const updates = {};
        if(eventname) updates.eventname = eventname;
        if(description) updates.description = description;
        if(datebegin) updates.datebegin  =datebegin;
        if(dateend) updates.dateend = dateend;
        if(phonenumber) updates.phonenumber =phonenumber;
        if(website) updates.website = website;
        if(location) updates.location = location;
        if(address) updates.address = address;
        if(status) updates.status = status;
        if(storeId) updates.storeId = storeId;
        if(req.file){
          const eventurlValue =req.file.location;
          updates.eventimage = eventurlValue;
        }
        try{
          const event = await Event.findById(eventId);
          if(!event)
          return next(new ErrorHandler("event not found"));
          if (updates.eventimage && event.eventimage) {
            await deleteFromS3(event.eventimage);
          }
          Object.assign(event, updates);
          await event.save();
          res.status(200).json({
            success:true,
            message:"Event updated successfully",
            event
          })

        }
        catch(err){
          res.status(500).json({
            success:false,
            message:"failed to update profile",
            error:err.message,
          })
        }
    })
  });
  
  export const addparticipantToEvent = catchAsyncError(async(req,res,next)=>{
    const {eventId,ticketCount} = req.body;
    const events = await Event.findById(eventId);
    // console.log(eventId)
    const participant = {
      user:req.user._id,
      name:req.user.name,
      eventname:events.eventname,
      status:events.status,
      datebegin:events.datebegin,
      dateend:events.dateend,
      ticketCount:ticketCount || 1

    }
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





  