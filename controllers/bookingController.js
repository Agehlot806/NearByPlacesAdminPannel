import { Booking } from "../models/Booking.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Store } from "../models/Stores.js";

export const NewBooking = catchAsyncError(async(req,res,next)=>{
    const {bookingId,bookingDate,BookingItem,paymentInfo,Tableprice,taxPrice,totalPrice} = req.body;
    const store = await Store.findById(req.body.StoreId);
   const userobj = {
    userId:req.user._id,
    name:req.user.name,
    email:req.user.email
   }
    const booking = await Booking.create({
        bookingId,bookingDate,BookingItem,paymentInfo,Tableprice,taxPrice,totalPrice,paidAt:Date.now(),
        storename:store.name,
        storenumber:store.phonenumber,
    })
    booking.userData.push(userobj);
    await booking.save();
    res.status(201).json({
        success:true,
        message:"Booking created Successfully",
        booking,
    })

});
export const getSingleBooking = catchAsyncError(async(req,res,next)=>{
    const booking = await Booking.findById(req.params.id).populate("user","name email");
    if (!booking) {
        return next(new ErrorHandler("Booking not found with this Id", 404));
      }
      res.status(200).json({
        success: true,
        booking,
      });

})
//logged In user Order
export const myBookings = catchAsyncError(async (req, res, next) => {
    const bookings = await Booking.find({ user: req.user._id });
    res.status(200).json({
      success: true,
      bookings,
    });
  });
  
  // get all Orders -- Admin
  export const getAllBookings = catchAsyncError(async (req, res, next) => {
    const bookings = await Booking.find();
    let totalAmount = 0;
    bookings.forEach((booking) => {
        totalAmount += booking.totalPrice;
    });
    res.status(200).json({
      success: true,    
      totalAmount,
      bookings,
    });
  });



  export const updateBooking = catchAsyncError(async (req, res, next) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return next(new ErrorHandler("booking not found with this Id", 404));
    }
  
    if (booking.BookingStatus === "Confirmed") {
      return next(new ErrorHandler("You have already Confirmed this Booking", 400));
    }
  
    order.orderStatus = req.body.status;
  
    if (req.body.status === "Delivered") {
      booking.deliveredAt = Date.now();
    }
  
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  });
  


