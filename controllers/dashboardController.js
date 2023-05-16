import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { User } from "../models/User.js";
import { Offer } from "../models/Offer.js";
import { Event } from "../models/Event.js";
import { Message } from "../models/Messages.js";
import { Store } from "../models/Stores.js";


export const getdashboardcountData = catchAsyncError(async(req,res,next)=>{
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
})