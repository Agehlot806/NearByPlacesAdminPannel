import { Booking } from "../models/Booking.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Store } from "../models/Stores.js";
import { BookingTable } from "../models/BookingTable.js";
import {instance} from "../server.js"
import { User } from "../models/User.js";
import { PaymentModel } from "../models/PaymentModel.js";
// import { v4 as uuidv4 } from "uuid";
export const NewBooking = catchAsyncError(async(req,res,next)=>{
  const {bookingDate,location,max_people, table_no,table_price,bookingTime,StoreId, tableId} = req.body;
  const store = await Store.findById(req.body.StoreId);
  console.log(store, 'store');
  const filterData = await BookingTable.findOne({store_id: StoreId });
  console.log(filterData, 'filterData');
  const tableData = await BookingTable.findOne({_id: tableId});
  console.log(tableData, 'tableData');
  if(tableData.tableStatus == "Available"){
 const userobj = {
  userId:req.user._id,
  name:req.user.name,
  email:req.user.email
 }
//  const bookingId = uuidv4();
const bookingId = Math.floor(1000 + Math.random() * 9000);
  const booking = await Booking.create({
      bookingId,bookingTime,
      table_price,
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
}
else {
  res.status(201).json({
    success:false,
    message:"Table is already booked in this time slot"
})
}
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
    let confirmed = 0;
    let pending = 0;
    bookings.forEach((booking) => {
        totalAmount += booking.totalPrice;
       if(booking.BookingStatus == "true")
       {
           confirmed = confirmed + 1;
       }
       else{
        pending = pending + 1;
       }
    });
    res.status(200).json({
      success: true,
      totalAmount,
      bookings,
      confirmed,
      pending
    });
  });
  export const DeleteBooking = catchAsyncError(async (req, res, next) => {
    const bookingId = req.params.id;
    const userId = req.user._id;
    const booking = await Booking.findOne({
      _id: bookingId,
      'userData.userId': userId,
    });
    if (!booking) {
      return next(new ErrorHandler('Booking not found', 404));
    }
    // Remove the booking from the userData array
    booking.userData = booking.userData.filter(
      (user) => user.userId.toString() !== userId.toString()
    );
    // If no user is left in the booking, delete the entire booking document
    if (booking.userData.length === 0) {
      await Booking.deleteOne({ _id: bookingId });
      return res.status(200).json({
        success: true,
        message: 'Booking deleted successfully',
      });
    }
    // Save the updated booking with the user removed
    await booking.save();
    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
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


  export const BookingCancellation = catchAsyncError(async (req, res, next) => {
    // console.log(req.user, 'req.user');
    const { BookingId } = req.body;
    const  razorpay_order_id  = req.params;
      
    console.log(BookingId, razorpay_order_id.id, "req.body");
    try {
      // Fetch the reservation from the database
      const booking = await PaymentModel.findOne({ razorpay_order_id: razorpay_order_id.id });
          console.log(booking, 'bookingData');
      if (!booking) {
        return next(new ErrorHandler('Booking not found', 404));
      }
  
      // Retrieve the full reservation data based on the reservationId
      const bookingData = await Booking.findOne({ _id: BookingId });
         console.log(bookingData, "data");
      if (!bookingData) {
        return next(new ErrorHandler('Booking not found', 404));
      }
  
      // Make a refund request to Razorpay
      const refund = await instance.payments.refund(booking.razorpay_payment_id);
  
      // Update the reservation status in the database
      bookingData.BookingStatus = 'cancelled';
      await bookingData.save();
  
      // Update the user's account balance or any other necessary actions
  
      res.status(200).json({
        success: true,
        message: 'Booking cancelled and refund processed successfully',
        refundAmount: refund.amount / 100, // Convert refund amount from paise to currency
      });
    } catch (error) {
      console.error('Error processing refund:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process refund',
      });       
    }
  });