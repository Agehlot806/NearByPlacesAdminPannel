import { Booking } from "../models/Booking.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Store } from "../models/Stores.js";
import mongoose from "mongoose";
//Create a booking api for userBooking
// export const NewBookingUser = async (req, res, next) => {
//   const storeId = req.params.storeId;
//   const tableId = req.params.tableId;
//   const { name, email, phoneNumber, date, time, people } = req.body;

//   try {
//     const storeData = await Store.findById(storeId);

//     if (!storeData) {
//       return res.status(404).json({
//         success: false,
//         message: "Store not found",
//       });
//     }

//     const table = storeData.tables.find((table) => table._id.toString() === tableId);

//     if (!table) {
//       return res.status(404).json({
//         success: false,
//         message: "Table not found",
//       });
//     }

//     // Check if the table is already booked for the selected date, time, and number of people
//     const isTableBooked = table.bookings && table.bookings.some(
//       (booking) => booking.date === date && booking.time === time && booking.people === people
//     );

//     if (isTableBooked) {
//       return res.status(400).json({
//         success: false,
//         message: "Table is already booked for the selected date, time, and number of people",
//       });
//     }

//     const bookingId = generateBookingId(); // Generate a unique 6-digit booking ID

//     const bookingEndTime = new Date(date);
//     bookingEndTime.setHours(parseInt(time.split(':')[0]) + 2);
//     bookingEndTime.setMinutes(parseInt(time.split(':')[1]));

//     const bookingDetails = new Booking({
//       bookingId,
//       user: req.user._id,
//       name,
//       email,
//       phoneNumber,
//       tableNumber: table.table_no,
//       date,
//       time,
//       people,
//       storeName: storeData.name,
//       storeId: storeData._id,
//       livelocation: storeData.livelocation,
//       bookingEndTime,
//     });

//     // table.bookings.push(bookingDetails);

//     // Update the tableStatus of the table to 'unavailable'
//     table.tableStatus = 'unavailable';

//     await storeData.save();

//     // Schedule a task to update the tableStatus back to 'available' after the booking end time
//     const currentTime = new Date();
//     const timeDifference = bookingEndTime - currentTime;
//     setTimeout(() => {
//       table.tableStatus = 'available';
//       storeData.save();
//     }, timeDifference);

//     await bookingDetails.save();

//     res.status(200).json({
//       success: true,
//       message: "Table booked successfully",
//       booking: bookingDetails,
//     });
//   } catch (err) {
//     next(err);
//   }
// };
export const NewBookingUser = async (req, res, next) => {
  const storeId = req.params.storeId;
  const tableId = req.params.tableId;
  const { name, email, phoneNumber, date, time, people } = req.body;

  try {
    const storeData = await Store.findById(storeId);

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const table = storeData.tables.find((table) => table._id.toString() === tableId);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    // Check if the table is already booked for the selected date, time, and number of people
    const isTableBooked = table.bookings && table.bookings.some(
      (booking) => booking.date === date && booking.time === time && booking.people === people
    );

    if (isTableBooked) {
      return res.status(400).json({
        success: false,
        message: "Table is already booked for the selected date, time, and number of people",
      });
    }

    const bookingId = generateBookingId(); // Generate a unique 6-digit booking ID

    const bookingEndTime = new Date();
    bookingEndTime.setMinutes(bookingEndTime.getMinutes() + 2);

    const bookingDetails = new Booking({
      bookingId,
      user: req.user._id,
      name,
      email,
      phoneNumber,
      tableNumber: table.table_no,
      date,
      time,
      people,
      storeName: storeData.name,
      storeId: storeData._id,
      livelocation: storeData.livelocation,
      bookingEndTime,
    });

    // Update the tableStatus of the table to 'unavailable'
    table.tableStatus = 'unavailable';

    await storeData.save();

    // Schedule a task to update the tableStatus back to 'available' after the booking end time
    const currentTime = new Date();
    const timeDifference = bookingEndTime - currentTime;
    setTimeout(() => {
      table.tableStatus = 'available';
      storeData.save();
    }, timeDifference);

    await bookingDetails.save();

    res.status(200).json({
      success: true,
      message: "Table booked successfully",
      booking: bookingDetails,
    });
  } catch (err) {
    next(err);
  }
};




// Function to generate a unique 6-digit booking ID
function generateBookingId() {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1) + min);
}


//get all booking of particular store
export const getAllBookings = async (req, res, next) => {
  const storeId = req.params.storeId;

  try {
    const storeData = await Store.findById(storeId);

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const bookings = await Booking.find({ storeId: storeData._id });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};

//logged In user Order
export const getUserBookings = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const bookings = await Booking.find({ user: userId });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};


//get single booking 
export const getBooking = async (req, res, next) => {
  const storeId = req.params.storeId;
  const bookingId = req.params.bookingId;

  try {
    const storeData = await Store.findById(storeId);

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bookingId',
      });
    }

    const booking = await Booking.findOne({ storeId: storeData._id, _id: bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (err) {
    next(err);
  }
};

//getAllStores Booking 
export const getAllBookingsAllStore = async (req, res, next) => {
  try {
    const bookings = await Booking.find();

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (err) {
    next(err);
  }
};
//DeleteBooking
export const deletebooking  = catchAsyncError(async(req,res,next)=>{
  const bookingId = req.params.bookingId;
  let booking = await Booking.findById(bookingId);
  if(!booking){
    return next(new ErrorHandler("Booking not found",400))
  }
  await booking.deleteOne();
  res.status(200).json({
    success:true,
    message:"Booking deleted successfully"
  })
})
 