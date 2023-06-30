import { Store } from "../models/Stores.js";
import { BookingTable } from "../models/BookingTable.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Booking } from "../models/Booking.js";
// import morgan from "morgan"// console.log(morgan);
// console.log(ErrorHandler)
export const createTable = async(req, res, next) => {
    const storeId = req.params.storeId;
    console.log(req.user, 'user');
    // const table = await BookingTable.findById(req.params.)
    // const bookingUser ={
    //   user:req.user._id,
    //   name:req.user.name,
    //   email:req.user.email,
    // }
    // console.log(bookingUser);
  if(req.user.role == "admin"){
    try {
      const newTable = new BookingTable({title: req.body.title,
        price: req.body.price,
        maxPeople: req.body.maxPeople,
        desc: req.body.desc,
        table_no: req.body.table_no,
        location: req.body.location,
        store_id: req.params.storeId,
        cancellation_charges:req.body.cancellation_charges,
        });
      const savedTable = await newTable.save();
      // try {
      //   await Store.findByIdAndUpdate(storeId, {
      //   //   $push: { tables: savedTable._id },
      //   $push:{tables:savedTable._id},
      //   // $push:{tablebookinguser:bookingUser}
      //   });
      // } catch (err) {
      //   next(err);
      // }
      res.status(200).json({
        sucess:true,
        savedTable,
      });
    } catch (err) {
      next(err);
    }
  }
  else {
    res.status(401).json({
      sucess:false,
      message: "You are not authenticated to create the table",
    });
  };
}
export const updatetableStatus = async(req,res,next) =>{
  const bookingID = req.body.bookingID;
  const tableId = req.params.id;
  const bookingFind = await Booking.findById(bookingID);
  if(bookingFind.BookingStatus=="Confirmed"){
    console.log(bookingFind, 'bookingFind');
    const tableFind = await BookingTable.findByIdAndUpdate(tableId);
    console.log(tableFind,"tablefinddata");
    tableFind.tableStatus="Unavalable";
   const finalres = await tableFind.save();
   res.status(200).json({
    success:true,
    message:"Talbe status update successfully",
    finalres,
  })
  }
  else{
    res.status(400).json({
      success:false,
      message:"slot not available",
      finalres,
    })

  }
  
}


export const updateTable = async (req, res, next) => {
  try {
    const updatetable = await BookingTable.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatetable);
  } catch (err) {
    next(err);
  }
};
export const updatetableAvailability = async (req, res, next) => {
  try {
    await BookingTable.updateOne(
      { "tableNumbers._id": req.params.id },
      {
        $push: {
          "tableNumbers.$.unavailableDates": req.body.dates
        },
      }
    );
    res.status(200).json("Table status has been updated.");
  } catch (err) {
    next(err);
  }
};
export const deleteTable = async (req, res, next) => {
  const storeId = req.params.storeId;
  try {
    await BookingTable.findByIdAndDelete(req.params.id);
    try {
      await Store.findByIdAndUpdate(storeId, {
        $pull: { tables: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Table has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const gettable= async (req, res, next) => {
  try {
    const table = await BookingTable.findById(req.params.id);
    res.status(200).json(table);
  } catch (err) {
    next(err);
  }
};
export const gettables = async (req, res, next) => {
  try {
    const tables = await BookingTable.find();
    const tablescount = await BookingTable.find().countDocuments()
    res.status(200).json({
        success:true,
        tables,
        tablescount,
    });
  } catch (err) {
    next(err);
  }
};