import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
import ApiFeatures from "../utils/apifeatures.js";
export const AddnewStore = catchAsyncError(async (req, res, next) => {
    const {name,category,phonenumber,website,details,videourl,latitude,longitude} = req.body;
    if (!name || !category||!latitude||!longitude||!phonenumber)
    return next(new ErrorHandler("please add all fields",400));
    let store = await Store.findOne({name})
    if(store)
    return next(new ErrorHandler("store already registerd",409));
        let storegallery =undefined;
        let storephoto = undefined;
        if(req.files['storegalleryfiles'][0]){
            const file = getDataUri(req.files['storegalleryfiles'][0]);
            const mycloud = await cloudinary.v2.uploader.upload(file.content);
            storegallery ={
              public_id:mycloud.public_id,
              url:mycloud.secure_url,
            }
          }
          if(req.files['storephotofiles'][0]){
            const file = getDataUri(req.files['storephotofiles'][0]);
            const mycloud = await cloudinary.v2.uploader.upload(file.content);
            storephoto ={
              public_id:mycloud.public_id,
              url:mycloud.secure_url,
            }
          }
          
    const newstoreobject = {
        name,category,phonenumber,website,details,videourl,latitude,longitude,storegallery,storephoto }
    store = new Store(newstoreobject);
    await store.save()
    res.status(201).json({
      success: true,
      message: "Store added Successfully.",
    });
  });

 
  export const GetAllStores  = catchAsyncError(async (req, res, next) => {
    const resultPerPage =5;
    const storeCount = await Store.countDocuments();
    const apiFeature = new ApiFeatures(Store.find(),req.query).search().filter().pagination(resultPerPage);
    let stores = await apiFeature.query;
    res.status(200).json({
      success: true,
      stores,
      storeCount,
      resultPerPage
    });
  });

  
export const DeleteStore = catchAsyncError(async (req, res, next) => {
    const store = await Store.findById(req.params.id);
    if (!store) return next(new ErrorHandler("Store not found", 404));
    await cloudinary.v2.uploader.destroy(store.storegallery.public_id);
    await cloudinary.v2.uploader.destroy(store.storephoto.public_id);
   await store.deleteOne();
    res.status(200).json({
      success: true,
      message: "Store Deleted Successfully",
    });
  });

  export const UpdateStore = catchAsyncError(async (req, res, next) => {
    const {name,category,phonenumber,website,details,videourl,latitude,longitude} = req.body;
    const store = await Store.findById(req.params.id);
    if (name) store.name = name;
    if (category) store.category = category;
    if (phonenumber) store.phonenumber = phonenumber;
    if (website) store.website = website;
    if (details) store.details = details;
    if (videourl) store.videourl = videourl;
    if (latitude) store.latitude = latitude;
    if (longitude) store.longitude = longitude;
    await store.save();
    res.status(200).json({
      success: true,
      message: "Store Updated Successfully",
      store
    });
  });


  export const UpdateStoreProfile= catchAsyncError(async (req, res, next) => {
    const store = await Store.findById(req.params.id);
    if(req.files['storegalleryfiles'][0]){
    const file = getDataUri(req.files['storegalleryfiles'][0]);
    await cloudinary.v2.uploader.destroy(store.storegallery.public_id);
    const mycloud = await cloudinary.v2.uploader.upload(file.content);
    store.storegallery ={
      public_id:mycloud.public_id,
      url:mycloud.secure_url,
    }
    }
   if(req.files['storephotofiles'][0]){
      const file = getDataUri(req.files['storephotofiles'][0]);
      await cloudinary.v2.uploader.destroy(store.storephoto.public_id);
      const mycloud = await cloudinary.v2.uploader.upload(file.content);
      store.storephoto ={
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
      }
      }
    await store.save();
    res.status(200).json({
      success: true,
      message: "Store Images  Updated Successfully",
    });
  });

  //create review by user and access to both admin and user 
  export const createStoreReview = catchAsyncError(async (req, res, next) => {
    const {rating, comment, StoreId } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
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


  //get store review by admin
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


//delete review by user
  export const deleteReview = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
  
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
  
    const reviews = product.reviews.filter(
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
  
    await Product.findByIdAndUpdate(
      req.query.productId,
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
  
