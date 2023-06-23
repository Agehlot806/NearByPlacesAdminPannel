import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/User.js";
import { Offer } from "../models/Offer.js";
import { Event } from "../models/Event.js";
import { Message } from "../models/Messages.js";
import { Store } from "../models/Stores.js";


export const getdashboardcountData = catchAsyncError(async(req,res,next)=>{
  console.log(req.user, 'user');
  var validate;
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { readAny: "dashboard" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
  {   validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }



  }
  if ( validate != undefined || req.user.role == "admin")  {
    const user = await User.countDocuments();
    const offer = await Offer.countDocuments();
    const event = await Event.countDocuments();
    const store = await Store.countDocuments();
    const msg = await Message.countDocuments();
    res.status(200).json( {
        success:true,
        message:"Getting dashboard data",
        user,
        offer,
        event,
        store,
        msg
    })
  }
  else{
    res.status(400).json({
      success:false,
      message:"You are not Authenticate reachOut Admin for more"
    })
  }
   
})

export const getGraphData = catchAsyncError(async (req, res, next) => {
  console.log(req.user, 'user');
  var validate;
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { readAny: "dashboard" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
  {   validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }



  }
  if ( validate != undefined || req.user.role == "admin")  {
 
    const user = await User.countDocuments();
    const offer = await Offer.countDocuments();
    const event = await Event.countDocuments();
    const store = await Store.countDocuments();
    const msg = await Message.countDocuments();
  
    // Create an array of objects representing the graph data
    const graphData = [
      { label: 'User', count: user },
      { label: 'Offer', count: offer },
      { label: 'Event', count: event },
      { label: 'Store', count: store },
      { label: 'Message', count: msg },
    ];
  
    // Return the graph data
    res.status(200).json({
      success: true,
      message: 'Getting graph data',
      graphData,
    });
  }
  else{
    res.status(400).json({
      success:false,
      message:"You are not Authenticate reachOut Admin for more"
    })
  }
  });
  
