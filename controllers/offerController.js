import { Offer } from "../models/Offer.js";
import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import ApiFeatures from "../utils/apifeatures.js";

export const AddnewOffer = catchAsyncError(async (req, res, next) => {
    const {name,description,PricingOfferValue,coupon_type,value,coupon_code,makeAdeal} = req.body;
    if (!name||!PricingOfferValue||!coupon_code||!coupon_type||!value)
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
        name,description,PricingOfferValue,makeAdeal,offerImage,coupon_code,value,coupon_type
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

  export const DeleteOffer = catchAsyncError(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return next(new ErrorHandler("Offer not found", 404));
    await cloudinary.v2.uploader.destroy(offer.offerImage.public_id);
    await cloudinary.v2.uploader.destroy(offer.offerImage.public_id);
   await offer.deleteOne();
    res.status(200).json({
      success: true,
      message: "Offer Deleted Successfully",
    });
  });

  export const UpdateOffer = catchAsyncError(async (req, res, next) => {
    const {name,description,PricingOfferValue,coupon_code,value,coupon_type,makeAdeal} = req.body;
    const offer = await Offer.findById(req.params.id);
    if (name) offer.name = name;
    if (description) offer.description = description;
    if (PricingOfferValue) offer.PricingOfferValue = PricingOfferValue;
    if (makeAdeal) offer.makeAdeal = makeAdeal;
    if (coupon_code) offer.coupon_code = coupon_code;
    if (coupon_type) offer.coupon_type = coupon_type;
    if (value) offer.value = value;
    await offer.save();
    res.status(200).json({
      success: true,
      message: "Offer Updated Successfully",
      offer
    });
  });


  export const UpdateOfferImage= catchAsyncError(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    if(req.file){
      const file = getDataUri(req.file);
      await cloudinary.v2.uploader.destroy(offer.offerImage.public_id);
      const mycloud = await cloudinary.v2.uploader.upload(file.content);
      offer.offerImage ={
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
      }
      }
    await offer.save();
    res.status(200).json({
      success: true,
      message: "Offer Image Successfully",
    });
  });