import { Booking } from "../models/Booking.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const NewBooking = catchAsyncError(async(req,res,next)=>{
    const {bookingId,bookingDate,BookingItem,paymentInfo,Tableprice,taxPrice,totalPrice} = req.body;
    const booking = await Booking.create({
        bookingId,bookingDate,BookingItem,paymentInfo,Tableprice,taxPrice,totalPrice,paidAt:Date.now(),
        user:req.user._id,
    })
    res.status(201).json({
        success:true,
        message:"Booking created Successfully",
        booking,
    })

});



