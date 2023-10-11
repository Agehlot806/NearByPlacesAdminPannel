import { Store } from "../models/Stores.js";
import { Booking } from "../models/Booking.js";
export const createTable = async (req, res, next) => {
  const storeId = req.params.storeId;
 
  try {
    const storeData = await Store.findById(storeId);
    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated to create the table",
      });
    }

    const existingTable = storeData.tables.find((table) => table.table_no === req.body.table_no);
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: "Table with the same table number already exists in the store",
      });
    }

    const newTable = {
      title: req.body.title,
      price: req.body.price,
      maxPeople: req.body.maxPeople,
      desc: req.body.desc,
      location: req.body.location,
      cancellation_charges: req.body.cancellation_charges,
      tableStatus:req.body.tableStatus,
    };

    // Generate table_no automatically
    const tableCount = storeData.tables.length + 1;
    newTable.table_no = `Table-${tableCount}`;

    storeData.tables.push(newTable);
    await storeData.save();

    res.status(200).json({
      success: true,
      message: "Table created successfully",
      table: newTable,
    });
  } catch (err) {
    next(err);
  }
};


export const updatetableStatus = async(req,res,next) =>{
  const bookingID = req.body.bookingID;
  const tableId = req.params.id;
  const bookingFind =await Booking.findOne({bookingId:bookingID});
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

//update tableData api 

export const updateTable = async (req, res, next) => {
  const storeId = req.params.storeId;
  const tableId = req.params.tableId;

  try {
    const storeData = await Store.findById(storeId);

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated to update the table",
      });
    }

    const tableToUpdate = storeData.tables.find((table) => table._id.toString() === tableId);

    if (!tableToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    tableToUpdate.title = req.body.title || tableToUpdate.title;
    tableToUpdate.price = req.body.price || tableToUpdate.price;
    tableToUpdate.maxPeople = req.body.maxPeople || tableToUpdate.maxPeople;
    tableToUpdate.desc = req.body.desc || tableToUpdate.desc;
    tableToUpdate.location = req.body.location || tableToUpdate.location;
    tableToUpdate.cancellation_charges = req.body.cancellation_charges || tableToUpdate.cancellation_charges;
    tableToUpdate.tableStatus = req.body.tableStatus || tableToUpdate.tableStatus;

    await storeData.save();

    res.status(200).json({
      success: true,
      message: "Table updated successfully",
      table: tableToUpdate,
    });
  } catch (err) {
    next(err);
  }
};
//Delete table from the store api 

export const deleteTable = async (req, res, next) => {
  const storeId = req.params.storeId;
  const tableId = req.params.tableId;

  try {
    const storeData = await Store.findById(storeId);

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "You are not authenticated to delete the table",
      });
    }

    const tableIndex = storeData.tables.findIndex((table) => table._id.toString() === tableId);

    if (tableIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Table not found",
      });
    }

    storeData.tables.splice(tableIndex, 1);
    await storeData.save();

    res.status(200).json({
      success: true,
      message: "Table deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

//get all tables of the store 
export const getAllTables = async (req, res, next) => {
  const storeId = req.params.storeId;

  try {
    const storeData = await Store.findById(storeId);

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const tables = storeData.tables;

    res.status(200).json({
      success: true,
      tables,
    });
  } catch (err) {
    next(err);
  }
};

//Get single table of the store 
export const getTable = async (req, res, next) => {
  const storeId = req.params.storeId;
  const tableId = req.params.tableId;

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

    res.status(200).json({
      success: true,
      table,
    });
  } catch (err) {
    next(err);
  }
};


//getalltableso of all Stores 
export const getAllTablesofAllStore = async (req, res, next) => {
  try {
    const stores = await Store.find();

    const allTables = stores.reduce((tables, store) => {
      return [...tables, ...store.tables];
    }, []);

    res.status(200).json({
      success: true,
      tables: allTables,
    });
  } catch (err) {
    next(err);
  }
};
