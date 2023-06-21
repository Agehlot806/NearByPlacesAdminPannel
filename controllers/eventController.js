import { Event } from "../models/Event.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import deleteFromS3, { eventuplaod } from "../middlewares/multer.js";
// import { User } from "../models/User.js";
import { User } from "../models/User.js";

import AccessControl from "accesscontrol";
const ac = new AccessControl();

export const roles = (function () {
  ac.grant("user")
    .readAny("event")
  ac.grant("admin")
    .createAny('event')
    .readAny('event')
    .updateAny("event")
    .deleteAny("event")
    .createAny('offer')
    .updateAny('offer')
    .deleteAny('offer')
    .readAny('offer')
    .createAny('store')
    .updateAny('store')
    .deleteAny('store')
    .readAny('store')

  return ac;
})();


export const AddnewEvent = catchAsyncError(async (req, res, next) => {
  var validate;
  console.log(req.user, 'user');
  console.log(req.user.permission, 'req.permission')

  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { createAny: "event" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
       validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')


  }

  eventuplaod(req, res, async (err) => {
    if (err)
      return next(new ErrorHandler("failed to upload event image try again later"));
    if ( validate != undefined || req.user.role == "admin") {
      const { eventname, description, datebegin, dateend, phonenumber, website, location1, address, status, storeId, EventType, EventPrice } = req.body;
      if (!eventname || !address || !phonenumber || !EventType)
        return next(new ErrorHandler("please add all fields", 400))
      let event = await Event.findOne({ eventname });
      if (event)
        return next(new ErrorHandler("Event already Exists", 409));
      const eventimagevalue = req.file.location;
      event = await Event.create({
        eventname, description, datebegin, dateend, phonenumber, website, location1, address, status, storeId, EventType, eventimage: eventimagevalue, EventPrice
      })
      res.status(201).json({
        success: true,
        message: "event created successfully",
        event
      })
    }
    else {
      res.status(400).json({
        success: false,
        message: "you are not authenticated"
      })
    }
  })
});


export const permissongive = async (req, res) => {
  console.log(req.user, 'usususu')
  if (req.user.role == "admin") {
    const { user, permissions } = req.body;
    console.log(user, 'id');
    console.log(req.body, 'req.body')
    const userFind = await User.findOne({ _id: user })
    console.log(userFind, 'userfind')
    if (ac.can('admin').createAny('event').granted) {
      // Logic to assign permissions to the user
      console.log(`Giving permissions to user: ${user}`);
      const p = permissions;

      ac.grant(userFind.role).p;
      const p2 = permissions;
      console.log(p2, 'p2');
      const existpermission = userFind.permission.includes({ p2 })
      //  if()
      console.log(existpermission, 'existpermission')
      // if (existpermission) {

      const alok = userFind.permission.push(p2);
      console.log(alok, 'alok');
      const userupdate = await userFind.save();

      console.log(userupdate, 'updateduser');

      res.status(200).json({ data: userupdate, message: `Permissions given to user: ${user}` });
      // }
      // else {
      //   res.status(403).json({ message: 'Access denied' });
      // }
    }
  }
  else {
    res.status(400).json({ message: "You are not authenticated to give permission" })
  }
};


export const permissiontake = async (req, res) => {

  console.log(req.user, 'usususu')
  const { user, permissions } = req.body;

  console.log(user, 'id');
  const userFind = await User.findOne({ _id: user })

  console.log(userFind, 'userfind')

  if (req.user.role == "admin") {

    console.log(permissions, 'permissions')

    const length = userFind.permission.length;

    console.log(length, 'length of array ')
    var usersave = {};

    for (var i = 0; i < length; i++) {
      console.log(userFind.permission[i], 'akshay')

      let b = userFind.permission[i];
      console.log(b, 'b of array ')

      let c = permissions;
      console.log(c, 'c of array ')

      console.log(JSON.stringify(c), 'cccccc')
      console.log(JSON.stringify(b), 'bbbbbbbbb')

      if (JSON.stringify(b) === JSON.stringify(c)) {
        const u = userFind.permission.splice(i, 1);

        console.log(u, 'u')
        usersave = await userFind.save();

        console.log(usersave, 'usersaved');

      }
    }
    res.status(200).json({ message: "Your `${permission}` are taken by admin", data: usersave })

  }
  else {
    res.status(403).json({ message: "This permission is not given to user" })
  }

};

export const GetAllEvents = catchAsyncError(async (req, res, next) => {
  const resultPerPage = 5;
  const EventCounts = await Event.countDocuments();
  const apiFeature = new ApiFeatures(Event.find(), req.query).search().filter().pagination(resultPerPage);
  let events = await apiFeature.query;

  // Retrieve user participation count for each event
  const eventCounts = await Promise.all(
    events.map(async (event) => {
      const userCount = event.usersparticipated.length;
      return { ...event._doc, userCount }; // Include userCount in the event object
    })
  );

  res.status(200).json({
    success: true,
    events: eventCounts, // Use eventCounts instead of the original events array
    EventCounts,
    resultPerPage,
  });
});


export const getEventById = catchAsyncError(async (req, res, next) => {
  const events = await Event.findById(req.params.id);
  res.status(200).json({
    success: true,
    events,
    totalparticipant: events.usersparticipated.length,
  });
});

// export const isPermission = (req, next) =>{
//   let length = req.user.permisson.length;
//   console.log(length, 'length')
//   for(var i = 0; i < length; i++){
//    if(req.user.permission[i] == { deleteAny:"event" })
//           next(); 
//   }
//   return next(
//         new ErrorHandler(
//           `${req.user.permission} is not allowed to access this resource`,
//           403
//         )
//       )
// }

export const DeleteEventById = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  console.log(req.user, 'user');
  var validate;
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { deleteAny: "event" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
  {   validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }



  }

  if (validate != undefined || req.user.role == "admin")
{
  const event = await Event.findById(eventId);

  if (!event) {
    return next(new ErrorHandler("Event not found", 404));
  }

  await event.deleteOne();
  res.status(200).json({
    success: true,
    message: "Event Deleted Successfully",
  });

}
else {
  res.status(400).json({
    success: false,
    message: "you are not authenticated"
  })
}
 });


export const UpdateEvent = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  console.log(req.user, 'user');
  var validate;
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { deleteAny: "event" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
  {   validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }



  }
  eventuplaod(req, res, async (err) => {
    if (err)
      return next(new ErrorHandler("failed to update image"));
      if ( validate != undefined || req.user.roles == "admin") {
        const { eventname, description, datebegin, dateend, phonenumber, website, EventPrice, location1, address, status, storeId } = req.body;
        const updates = {};
        if (eventname) updates.eventname = eventname;
        if (description) updates.description = description;
        if (datebegin) updates.datebegin = datebegin;
        if (dateend) updates.dateend = dateend;
        if (phonenumber) updates.phonenumber = phonenumber;
        if (website) updates.website = website;
        if (location1) updates.location1 = location1;
        if (address) updates.address = address;
        if (status) updates.status = status;
        if (storeId) updates.storeId = storeId;
        if (EventPrice) updates.EventPrice = EventPrice;
        if (req.file) {
          const eventurlValue = req.file.location;
          updates.eventimage = eventurlValue;
        }
          const event = await Event.findById(eventId);
          if (!event)
            return next(new ErrorHandler("event not found"));
          if (updates.eventimage && event.eventimage) {
            await deleteFromS3(event.eventimage);
          }
          Object.assign(event, updates);
          await event.save();
          res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
          })
      }
      else {
        res.status(400).json({
          success: false,
          message: "you are not authenticated"
        })
      }
  
  })
});

export const addparticipantToEvent = catchAsyncError(async (req, res, next) => {
  const { eventId, ticketCount } = req.body;
  const events = await Event.findById(eventId);
  // console.log(eventId)
  const participant = {
    user: req.user._id,
    name: req.user.name,
    eventname: events.eventname,
    status: events.status,
    datebegin: events.datebegin,
    dateend: events.dateend,
    ticketCount: ticketCount || 1

  }
  const isParticipated = events.usersparticipated.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isParticipated) {
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
    totalparticipant: events.usersparticipated.length

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





