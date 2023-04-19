import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js";
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
    const stores = await Store.find({});
    res.status(200).json({
      success: true,
      stores,
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



