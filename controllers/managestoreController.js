import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import { Category } from "../models/Application.js";
import { storeupload } from "../middlewares/multer.js";
import deleteFromS3 from "../middlewares/multer.js";
export const AddnewStore = catchAsyncError(async (req, res, next) => {
    storeupload(req,res,async(err)=>{
      if (err)
      return res.status(400).json({ success: false, message: err.message });
      const {name,phonenumber,website,details,videourl,latitude,longitude,status,storeownername} = req.body;
      const photoUrl1Value = req.files['storephoto'][0].location;
      const photoUrl2Value = req.files['storegallery'][0].location;
      if (!name||!latitude||!longitude||!phonenumber)
      return next(new ErrorHandler("please add all fields",400));
      let store = await Store.findOne({name})
      if(store)
      return next(new ErrorHandler("store already registerd",409));
      const {categoryId} = req.params;
      const newstoreobject = {
        name,phonenumber,website,details,videourl,latitude,longitude,storegallery:photoUrl2Value,storephoto:photoUrl1Value,status,storeownername,category:categoryId};
        store = new Store(newstoreobject);
        await Category.findByIdAndUpdate(categoryId,{$push:{stores:store._id}},{new:true});
        await store.save();
        res.status(201).json({
          success: true,
          message: "Store added Successfully.",
          store,
        });
    })
  });


  export const GetAllStores  = catchAsyncError(async (req, res, next) => {
    const resultPerPage =5;
    const storeCount = await Store.countDocuments();
    const apiFeature = new ApiFeatures(Store.find().populate("category","categoryname"),req.query).search().filter().pagination(resultPerPage);
    let stores = await apiFeature.query;
    res.status(200).json({
      success: true,
      stores,
      storeCount,
      resultPerPage
    });
  });
 

  export const GetAllStoresRecentAdded = catchAsyncError(async (req, res, next) => {
    const store = await Store.find().populate("category","categoryname")
    const recentStores = store.reverse().slice(0, 5);
    res.status(200).json({
      success:true,
      store:recentStores,
    })
  });
  


  export const getStoreBYId = catchAsyncError(async (req, res, next) => {
    const stores = await Store.findById(req.params.id);
    res.status(200).json({
      success: true,
      stores   
    });
  });

export const DeleteStore = catchAsyncError(async (req, res, next) => {
  const storeId = req.params.id;
  try{
    const store = await Store.findById(storeId);
    if (!store) return next(new ErrorHandler("Store not found", 404));
    await store.deleteOne();
    res.status(200).json({
      success: true,
      message: "Store Deleted Successfully",
    });
  }catch(error){
    next(ErrorHandler("failed to delete event",500))
  }
  });

  // export const UpdateStore = catchAsyncError(async (req, res, next) => {
  //   const storeId = req.params.id;
  //   storeupload(req,res,async(err)=>{
  //     if (err)
  //       return next(new ErrorHandler("failed to update image"));
  //       const {name,category,phonenumber,website,details,videourl,latitude,longitude,status,storeownername} = req.body;
  //       console.log(name)
  //       const updates = {};
  //       if (name) updates.name = name;
  //       if (category) updates.category = category;
  //       if (phonenumber) updates.phonenumber = phonenumber;
  //       if (website) updates.website = website;
  //       if (details) updates.details = details;
  //       if (videourl) updates.videourl = videourl;
  //       if (latitude) updates.latitude = latitude;
  //       if (longitude) updates.longitude = longitude;
  //       if (status) updates.status = status;
  //       if (storeownername) updates.storeownername = storeownername;
  //      if (req.files['storephoto']) {
  //       const photoUrl1Value = req.files['storephoto'][0].location;
  //       updates.storephoto = photoUrl1Value;
  //     }
  
  //     if (req.files['storegallery']) {
  //       const photoUrl2Value = req.files['storegallery'][0].location;
  //       updates.storegallery = photoUrl2Value;
  //     }
  //     try{
  //       const store = await Store.findById(storeId);
  //       if(!store)
  //       return next(new ErrorHandler("Store not found"));
  //       if (updates.storephoto && store.storephoto) {
  //         await deleteFromS3(store.storephoto);
  //       }
  //       if (updates.storegallery && store.storegallery) {
  //         await deleteFromS3(store.storegallery);
  //       }

  //       Object.assign(store, updates);
  //       await store.save();
  //       res.status(200).json({
  //         success: true,
  //         message: "Store updated successfully",
  //         store
  //       });
  //     }catch(error){
  //       res.status(500).json({
  //         success: false,
  //         message: "Failed to update profile",
  //         error: error.message,
  //       });
  //     }
  //   })
  // });
  export const UpdateStore = catchAsyncError(async (req, res, next) => {
    const storeId = req.params.id;
    storeupload(req, res, async (err) => {
      if (err) {
        return next(new ErrorHandler("Failed to update image"));
      }
      const {
        name,
        category,
        phonenumber,
        website,
        details,
        videourl,
        latitude,
        longitude,
        status,
        storeownername
      } = req.body;
      console.log(name);
      const updates = {};
      if (name) updates.name = name;
      if (category) updates.category = category;
      if (phonenumber) updates.phonenumber = phonenumber;
      if (website) updates.website = website;
      if (details) updates.details = details;
      if (videourl) updates.videourl = videourl;
      if (latitude) updates.latitude = latitude;
      if (longitude) updates.longitude = longitude;
      if (status) updates.status = status;
      if (storeownername) updates.storeownername = storeownername;
      if (req.files['storephoto']) {
        const photoUrl1Value = req.files['storephoto'][0].location;
        updates.storephoto = photoUrl1Value;
      }
  
      if (req.files['storegallery']) {
        const photoUrl2Value = req.files['storegallery'][0].location;
        updates.storegallery = photoUrl2Value;
      }
      try {
        const store = await Store.findById(storeId);
        if (!store) {
          return next(new ErrorHandler("Store not found"));
        }
        if (updates.storephoto && store.storephoto) {
          await deleteFromS3(store.storephoto);
        }
        if (updates.storegallery && store.storegallery) {
          await deleteFromS3(store.storegallery);
        }
  
        Object.assign(store, updates);
        await store.save();
        res.status(200).json({
          success: true,
          message: "Store updated successfully",
          store
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Failed to update profile",
          error: error.message
        });
      }
    });
  });
  
  
//user store reviews 
  export const createStoreReviews = catchAsyncError(async (req, res, next) => {
    const { rating, comment, StoreId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      image:req.user.adminavatar,
    };
    const store = await Store.findById(StoreId);
    const isReviewed = store.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      store.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      store.reviews.push(review);
      store.numOfReviews = store.reviews.length;
    }
  
    let avg = 0;
  
    store.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    store.ratings = avg / store.reviews.length;
  
    await store.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });
  
  // Get All Reviews of a product
  export const getStoreReview = catchAsyncError(async (req, res, next) => {
    const store = await Store.findById(req.query.id);
  
    if (!store) {
      return next(new ErrorHandler("Store not found", 404));
    }
    res.status(200).json({
      success: true,
      reviews: store.reviews,
    });
  });
  
  // Delete Review
  export const deleteReview = catchAsyncError(async (req, res, next) => {
    const store = await Store.findById(req.query.StoreId);
  
    if (!store) {
      return next(new ErrorHandler("Store not found", 404));
    }
    const reviews = store.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );
  
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    let ratings = 0;
  
    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }
  
    const numOfReviews = reviews.length;
  
    await Store.findByIdAndUpdate(
      req.query.StoreId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
  
    res.status(200).json({
      success: true,
    });
  });


//get all reviews of all store
export const getAllStoreReviews = catchAsyncError(async (req, res, next) => {
  const stores = await Store.find();
  let allReviews = [];

  stores.forEach((store) => {
    allReviews = allReviews.concat(store.reviews);
  });

  res.status(200).json({
    success: true,
    reviews: allReviews,
  });
});




