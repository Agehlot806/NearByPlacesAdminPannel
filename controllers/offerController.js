import { Offer } from "../models/Offer.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import deleteFromS3, { offerupload } from "../middlewares/multer.js";


export const AddnewOffer = catchAsyncError(async (req, res, next) => {
  offerupload(req,res,async(err)=>{
    if (err)
    return next(new ErrorHandler("failed to upload image try again later"));
    const {name,description,PricingOfferValue,coupon_type,value,coupon_code,status,datebegin,dateend,offerstore,priceUsd,percent} = req.body;
    if (!name||!PricingOfferValue||!coupon_code||!coupon_type||!value)
    return next(new ErrorHandler("Please enter all field", 400));
    let offer = await Offer.findOne({name});
    if (offer) return next(new ErrorHandler("Offer Already Exist", 409));
    const offerimagevalue = req.file.location;
    offer = await Offer.create({
      name,description,PricingOfferValue,offerimage:offerimagevalue,coupon_code,value,coupon_type,datebegin,dateend,status,offerstore,priceUsd,percent
    });
    res.status(201).json({
      success:true,
      message:"offer created successfully",
      offer
    })
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
    const offerId = req.params.id;
    try{
      const offer = await Offer.findById(offerId);
      if (!offer) return next(new ErrorHandler("Offer not found", 404));
      await offer.deleteOne();
    res.status(200).json({
      success: true,
      message: "Offer Deleted Successfully",
    });
    }catch(error){
      next(ErrorHandler("failder to delete Offer",500))
    }
  });

  export const UpdateOffer = catchAsyncError(async (req, res, next) => {
    const offerId = req.params.id;
    offerupload(req,res,async(err)=>{
      if (err) {
        return next(new ErrorHandler("Failed to update image"));
      }
      const {name,description,PricingOfferValue,coupon_type,value,coupon_code,status,datebegin,dateend,offerstore,priceUsd,percent} = req.body;
      const updates = {};
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (PricingOfferValue) updates.PricingOfferValue = PricingOfferValue;
      if (coupon_code) updates.coupon_code = coupon_code;
      if (coupon_type) updates.coupon_type = coupon_type;
      if (value) updates.value = value;
      if(status) updates.status = status;
      if(datebegin) updates.datebegin = datebegin;
      if(dateend) updates.dateend = dateend;
      if(offerstore) updates.offerstore = offerstore;
      if(priceUsd) updates.priceUsd = priceUsd;
      if(percent) updates.percent = percent;
      if (req.file) {
        const photoUrl1Value = req.file.location;
        updates.offerimage = photoUrl1Value;
      }
      try{
        const offer = await Offer.findById(offerId);
        if(!offer)
        return next(new ErrorHandler("offer not found"));
        if (updates.offerimage && offer.offerimage) {
          await deleteFromS3(offer.offerimage);
        }
        Object.assign(offer, updates);
        await offer.save();
        res.status(200).json({
          success: true,
          message: "Offer Updated Successfully",
          offer
        });
      }catch(error){
        res.status(500).json({
          success:false,
          message:"failed to update offer",
          error:err.message,
        })
      }
    })
  });


  export const GetOfferById = catchAsyncError(async (req, res, next) => {
    const offer = await Offer.findById(req.params.id);
    res.status(200).json({
      success: true,
      offer
    });
  })