import { CMS } from "../models/cmsModel.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const CreateMangeMenu  =  catchAsyncError(async(req,res,next)=>{
    const {Title,Link} = req.body;
    if(!Title||!Link)
    return next(new ErrorHandler("Please add all fields"));
    let cmsmenu  = await CMS.findOne({Link});
    if(cmsmenu)
    return next(new ErrorHandler("Cms page already exists"));
    cmsmenu = await CMS.create({
        Title,Link
    })
    await cmsmenu.save();
    res.status(201).json({
        success:true,
        message:"cms created successfully",
        cmsmenu,
    })

});


export const editcmsMenu = catchAsyncError(async(req,res,next)=>{
    const {Title,Link} = req.body;
    const cms = await CMS.findById(req.params.id);
    if(!cms)
    return next(new ErrorHandler("cms not found"));
    if(Title) cms.Title = Title;
    if (Link) cms.Link = Link;
    await cms.save();
    res.status(200).json({
        success:true,
        message:"cms update succesfully",
        cms,
    })
})

export const DeleteCms = catchAsyncError(async(req,res,next)=>{
    const cms = await CMS.findById(req.params.id);
    if(!cms)
    return next(new ErrorHandler("cms not found"))
    await cms.deleteOne();
    res.status(200).json({
        success:true,
        message:"cms Deleted succesfully",
        cms,
    })
})

export const getallcmspages = catchAsyncError(async(req,res,next)=>{
    const cms = await CMS.find();
    res.status(200).json({
        success:true,
        message:"getting all the cms pages",
        cms,
    })
});

export const getcmsbyId = catchAsyncError(async(req,res,next)=>{
    const cms = await CMS.findById(req.params.id);
    if(!cms)
    return next(new ErrorHandler("cms not found"))
    res.status(200).json({
        success:true,
        message:"getting  the cms pages",
        cms,
    })
});



