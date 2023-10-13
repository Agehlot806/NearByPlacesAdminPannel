import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Chefinstore } from "../models/ChefInstore.js";
import { Store } from "../models/Stores.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import mongoose from "mongoose";

export const AddnewChef = catchAsyncError(async (req, res, next) => {
  try {
    const { cname, phone, address, chefId } = req.body;
    const sid = req.params.id;
    const mystore = await Store.findById(sid);
    if (!cname || !phone)
      return next(new ErrorHandler("Please enter all field", 400));
    const addchef = await Chefinstore.create({
      cname,
      phone,
      address,
      chefId,
      storeId: sid,
    });
    await addchef.save();
    res.status(201).json({
      success: true,
      message: "Chef is successfully created",
      addchef,
    });
  } catch (error) {
    console.error("Error while creating chef", error);
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const Getallchef = catchAsyncError(async (req, res, next) => {
  try {
    const getchef = await Chefinstore.aggregate([
      {
        $lookup: {
          from: "stores",
          localField: "storeId",
          foreignField: "_id",
          as: "Stores-data",
        },
      },
    ]);
    return res.status(200).json({
      success: true,
      message: "Here is the list of allChef",
      getchef,
    });
  } catch (error) {
    console.error("Error while fetching chef", error.message);
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const Getsinglechef = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const getchef = await Chefinstore.findById(id).populate("storeId");
    return res.status(200).json({
      success: true,
      message: "chef",
      getchef,
    });
  } catch (error) {
    console.error("Error while fetching chef", error.message);
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const Addchefspec = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const chefs = await Chefinstore.findById(id);
    if (!chefs) {
      return res.status(404).json({
        message: "No chefs found",
      });
    }
    const newch = {
      dishname: req.body.dishname,
      dishprice: req.body.dishprice,
      dishtype: req.body.dishtype,
    };
    chefs.chefspec.push(newch);
    await chefs.save();
    res.status(200).json({
      success: true,
      message: "chefspec created successfully",
      List: newch,
    });
  } catch (error) {
    console.log("Error in adding chef", error.message);
    return next(new ErrorHandler("Something went wrong", 500));
  }
});

export const updateChef = catchAsyncError(async (req, res, next) => {
  try {
    const update_data = req.body;
    const id = req.params.id;

    const mydata = await Chefinstore.findByIdAndUpdate(
      id,
      { $set: update_data },
      { new: true }
    );

    if (!mydata) {
      return next(new ErrorHandler("Chef not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Here is the updated data",
      mydata,
    });
  } catch (error) {
    console.log("Following is the error", error.message);
    return next(new ErrorHandler("Something Went Wrong", 500));
  }
});

export const deleteChef = catchAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const deletchef = await Chefinstore.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "chef has been deleted successfully",
      deletchef,
    });
  } catch (error) {
    console.log("following are the errors", error.message);
    return next(new ErrorHandler("Something Went Wrong", 500));
  }
});
