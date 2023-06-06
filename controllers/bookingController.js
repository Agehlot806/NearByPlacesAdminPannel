import { Booking } from "../models/Booking.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Store } from "../models/Stores.js";
// import { v4 as uuidv4 } from "uuid";

export const NewBooking = catchAsyncError(async(req,res,next)=>{
    const {bookingDate,BookingItem,paymentInfo,Tableprice,taxPrice,totalPrice} = req.body;
    const store = await Store.findById(req.body.StoreId);
   const userobj = {
    userId:req.user._id,
    name:req.user.name,
    email:req.user.email

   }
  //  const bookingId = uuidv4();
  const bookingId = Math.floor(1000 + Math.random() * 9000);
    const booking = await Booking.create({
        bookingId,bookingDate,BookingItem,paymentInfo,Tableprice,taxPrice,totalPrice,paidAt:Date.now(),
        storename:store.name,
        storenumber:store.phonenumber,
        storeimage:store.storephoto,
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
    const booking = await Booking.findById(req.params.id);
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



  export const updateBookingStatus = catchAsyncError(async (req, res, next) => {
    const { bookingId, BookingStatus } = req.body;
  
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(new ErrorHandler("Booking not found", 404));
    }
  
    booking.BookingStatus = BookingStatus;
    await booking.save();
  
    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  });
  
  


