import { Offer } from "../models/Offer.js";
import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import ApiFeatures from "../utils/apifeatures.js";

export const AddnewOffer = catchAsyncError(async (req, res, next) => {
    const {name,description,PricingOfferValue,couponConfig,makeAdeal} = req.body;
    if (!name||!PricingOfferValue||!couponConfig)
      return next(new ErrorHandler("Please enter all field", 400));
    let offer = await Offer.findOne({name});
    if (offer) return next(new ErrorHandler("Offer Already Exist", 409));
    let offerImage = undefined;
        if(req.file){
            const file = getDataUri(req.file);
             const mycloud = await cloudinary.v2.uploader.upload(file.content);
             offerImage ={
               public_id:mycloud.public_id,
               url:mycloud.secure_url,
             }
           }
    offer = await Offer.create({
        name,description,PricingOfferValue,couponConfig,makeAdeal,offerImage
    });  

    res.status(201).json({
      success:true,
      message:"offer created successfully",
      offer
    })

  });

  export const GetallOffers  = catchAsyncError(async (req, res, next) => {
    const resultPerPage =5;
    const offercount = await Offer.countDocuments();
    const apiFeature = new ApiFeatures(Offer.find(),req.query).search().filter().pagination(resultPerPage);
    let offer = await apiFeature.query;
    res.status(200).json({
      success: true,
      offer,
      offercount,
      resultPerPage
    });
  });