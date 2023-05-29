import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Category } from "../models/Application.js";
import { categoryupload } from "../middlewares/multer.js";
import deleteFromS3 from "../middlewares/multer.js";
export const addnewCategory = catchAsyncError(async(req,res,next)=>{
  categoryupload(req,res,async(err)=>{
    if (err)
      return res.status(400).json({ success: false, message: err.message });
      const {categoryname} = req.body;
      const categoryurlvalue1 = req.files['categoryimage'][0].location;
      const categoryurlvalue2 = req.files['categoryicon'][0].location;
    if(!categoryname)
    return next(new ErrorHandler("please add all fields",400));
    let category = await Category.findOne({categoryname});
    if(category)
    return next(new ErrorHandler("category already defined",409));
    category = await Category.create({
      categoryname,categoryimage:categoryurlvalue1,categoryicon:categoryurlvalue2
     })
     res.status(201).json({
      success:true,
      message:"category added successfully",
      category,
     })

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
    const categoryId= req.params.id;
    try{
      const category = await Category.findById(categoryId);
      if(!category)return next(new ErrorHandler("category not found",404));
      await category.deleteOne();
       res.status(200).json({
         success: true,
         message: "category Deleted Successfully",
       });
    }catch(error){
      next(ErrorHandler("failer to delete the category"))
    }
})

export const GetcategorybyId = catchAsyncError(async(req,res,next)=>{
  const category = await Category.findById(req.params.categoryId).populate("stores","name status reviews storeownername storephoto storegallery ratings")
  res.status(200).json( {
      success:true,
      category
  })
})

export const updateCategoryData = catchAsyncError(async(req,res,next)=>{
    const categoryId = req.params.id;
    categoryupload(req,res,async(err)=>{
      if (err) {
        return next(new ErrorHandler("Failed to update image"));
      }
      const {categoryname} = req.body;
      const updates ={};
      if(categoryname){
        updates.categoryname = categoryname;
      }
  
      if (req.files['categoryimage']) {
        const photoUrl1Value = req.files['categoryimage'][0].location;
        updates.categoryimage = photoUrl1Value;
      }
  
      if (req.files['categoryicon']) {
        const photoUrl2Value = req.files['categoryicon'][0].location;
        updates.categoryicon = photoUrl2Value;
      }
      try{
        const category = await Category.findById(categoryId);
        if(!category)
          return next(new ErrorHandler("Category not found"));
        if (updates.categoryimage && category.categoryimage) {
          await deleteFromS3(category.categoryimage);
        }
        if (updates.categoryicon && category.categoryicon) {
          await deleteFromS3(category.categoryicon);
        }

        Object.assign(category, updates);
        await category.save();
        res.status(200).json({
          success:true,
          message:"category updated successfully",
          category
      })
      }catch(error){
        res.status(500).json({
          success: false,
          message: "Failed to update category",
          error: error.message
        });
      }
    })
    
})