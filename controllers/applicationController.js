import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Category } from "../models/Application.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";


export const addnewCategory = catchAsyncError(async(req,res,next)=>{
    const {categoryname} = req.body;
    if(!categoryname)
    return next(new ErrorHandler("please add all fields",400));
    let category = await Category.findOne({categoryname});
    if(category)
    return next(new ErrorHandler("category already defined",409));
    let categoryImage = undefined;
    let categoryIcon = undefined;
    if(req.files['categoryimagefile'][0]){
        const file = getDataUri(req.files['categoryimagefile'][0]);
        const mycloud = await cloudinary.v2.uploader.upload(file.content);
        categoryImage ={
          public_id:mycloud.public_id,
          url:mycloud.secure_url,
        }
      }
      if(req.files['categoryiconfile'][0]){
        const file = getDataUri(req.files['categoryiconfile'][0]);
        const mycloud = await cloudinary.v2.uploader.upload(file.content);
        categoryIcon ={
          public_id:mycloud.public_id,
          url:mycloud.secure_url,
        }
      }
       category = await Category.create({
        categoryname,categoryImage,categoryIcon
       })


       res.status(201).json({
        success:true,
        message:"category added successfully",
        category,
       })
    
});


export const getAllCategory = catchAsyncError(async(req,res,next)=>{
    const category  = await Category.find({});
    res.status(200).json({
        success:true,
        message:"getting all the category",
        category
    })
})

export const DeleteCategory = catchAsyncError(async(req,res,next)=>{
    const category = await Category.findById(req.params.id);
    if(!category)return next(new ErrorHandler("category not found",404));
    await cloudinary.v2.uploader.destroy(category.categoryImage.public_id);
    await cloudinary.v2.uploader.destroy(category.categoryIcon.public_id);
    await category.deleteOne();
     res.status(200).json({
       success: true,
       message: "category Deleted Successfully",
     });

})

export const GetcategorybyId = catchAsyncError(async(req,res,next)=>{
    const category = await Category.findById(req.params.categoryId).populate("stores","name status reviews storeownername storephoto storegallery ratings")
    res.status(200).json( {
        success:true,
        category
    })
})

export const updateCategoryData = catchAsyncError(async(req,res,next)=>{
    const {categoryname} = req.body;
    const category = await Category.findById(req.params.id);
    if(categoryname) category.categoryname = categoryname;
    await category.save();
    res.status(200).json({
        success:true,
        message:"category updated successfully",
        category
    })
})