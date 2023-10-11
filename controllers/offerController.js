import { Offer } from "../models/Offer.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import { offerupload } from "../middlewares/multer.js";
import deleteFromS3 from "../middlewares/multer.js";
import { roles } from "./eventController.js";


export const AddnewOffer = catchAsyncError(async (req, res, next) => {
  var validate;
  console.log(req.user, 'user');
  console.log(req.user.permission, 'req.permission')
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { createAny: "offer" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
       validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')

  }
  offerupload(req,res,async(err)=>{
    if (err)
    return next(new ErrorHandler("failed to upload image try again later"));
    if ( validate != undefined || req.user.role == "admin"){
      const {offername,description,PricingOfferValue,coupon_type,value,coupon_code,status,datebegin,dateend,offerstore,priceUsd,percent} = req.body;
      if (!offername||!coupon_type||!value)
      return next(new ErrorHandler("Please enter all field", 400));
      let offer = await Offer.findOne({offername});
      if (offer) return next(new ErrorHandler("Offer Already Exist", 409));
      const offerimagevalue = req.file.location;
      offer = await Offer.create({
        offername,description,PricingOfferValue,offerimage:offerimagevalue,coupon_code,value,coupon_type,datebegin,dateend,status,offerstore,priceUsd,percent
      });
      res.status(201).json({
        success:true,
        message:"offer created successfully",
        offer
      })
    }
    
    else {
      res.status(400).json({
        success: false,
        message: "you are not authenticated"
      })
    }

   
  })
  });

  export const GetallOffers  = catchAsyncError(async (req, res, next) => {
  console.log(req.user, 'user');
  var validate;
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { readAny: "offer" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
  {   validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }



  }
  if ( validate != undefined || req.user.role == "admin") {
    const resultPerPage =5;
    const offercount = await Offer.countDocuments();
    const apiFeature = new ApiFeatures(Offer.find(),req.query).search().filter().pagination(resultPerPage);
    let offer = await apiFeature.query;
    res.status(200).json({
      success: true,
      message:"Here is the list of all offers available",
      offer,
      offercount,
      resultPerPage
    });
  }
  else{
    res.status(400).json({
      success:false,
      message:"you do not have access reactout admin"
    })
  }

   
  });



  export const DeleteOffer = catchAsyncError(async (req, res, next) => {
    const offerId = req.params.id;
    console.log(req.user, 'user');
    var validate;
    var length1 = req.user.permission.length;
    console.log(length1, 'length');
    // var validate;
    for (var i = 0; i < length1; i++) {
  
      var b = req.user.permission[i];
      var c = { deleteAny: "offer" }
  
      console.log(JSON.stringify(c), 'cccccc')
  
      console.log(JSON.stringify(b), 'bbbbbbbbb')
  
      if (JSON.stringify(c) === JSON.stringify(b))
    {   validate = req.user.permission[i];
  
      console.log(req.user.permission[i], 'iiii')
      console.log(validate, 'validate')
    }
  
    }
      if (validate != undefined || req.user.role == "admin"){
          const offer = await Offer.findById(offerId);
          if (!offer) return next(new ErrorHandler("Offer not found", 404));
          await offer.deleteOne();
        res.status(200).json({
          success: true,
          message: "Offer Deleted Successfully",
        });

      }
  });

  export const UpdateOffer = catchAsyncError(async (req, res, next) => {
    const offerId = req.params.id;
    console.log(req.user, 'user');
    var validate;
    var length1 = req.user.permission.length;
    console.log(length1, 'length');
    // var validate;
    for (var i = 0; i < length1; i++) {
  
      var b = req.user.permission[i];
      var c = { updateAny: "offer" }
  
      console.log(JSON.stringify(c), 'cccccc')
  
      console.log(JSON.stringify(b), 'bbbbbbbbb')
  
      if (JSON.stringify(c) === JSON.stringify(b))
    {   validate = req.user.permission[i];
  
      console.log(req.user.permission[i], 'iiii')
      console.log(validate, 'validate')
    }
    }
    offerupload(req,res,async(err)=>{
      if (err) {
        return next(new ErrorHandler("Failed to update image"));
      }
      if ( validate != undefined || req.user.role == "admin") {
        const {offername,description,PricingOfferValue,coupon_type,value,coupon_code,status,datebegin,dateend,offerstore,priceUsd,percent} = req.body;
        const updates = {};
        if (offername) updates.offername = offername;
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
      }
      else {
        res.status(400).json({
          success: false,
          message: "you are not authenticated"
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
