import { Store } from "../models/Stores.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiFeatures from "../utils/apifeatures.js";
import { Category } from "../models/Application.js";
import { storeupload, subscriptionUpload } from "../middlewares/multer.js";
import deleteFromS3 from "../middlewares/multer.js";
import { User } from "../models/User.js";
import { Subscription } from "../models/SubscriptionMerchant.js";
import {instance} from "../server.js";
import crypto from "crypto";
import { SubscriptionModel } from "../models/subscriptionMerchantPayment.js";
// import nodeGeocoder from 'node-geocoder';
import nodeGeocoder from 'node-geocoder';
import QRCode from "qrcode";

export const AddnewStore = catchAsyncError(async (req, res, next) => {
  var validate;
  console.log(req.user, 'user');
  console.log(req.user.permission, 'req.permission')

  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {
    var b = req.user.permission[i];
    var c = { createAny: "store" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
      validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }

  storeupload(req, res, async (err) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message });

    if (validate != undefined || req.user.role == "admin") {
      const { name, phonenumber, website, details, videourl, latitude, longitude, status, storeownername, subscriptionPlanId,availableMenu} = req.body;
      const photoUrl1Value = req.files['storephoto'][0].location;
      const photoUrl2Value = req.files['storegallery'][0].location;

      if (!name || !latitude || !longitude || !phonenumber)
        return next(new ErrorHandler("Please add all fields", 400));

      let store = await Store.findOne({ name })
      if (store)
        return next(new ErrorHandler("Store already registered", 409));

      const { categoryId } = req.params;

      let options = {
        provider: 'openstreetmap'
      };

      let geoCoder = nodeGeocoder(options);

      let livelocation = [];

      try {
        const response = await geoCoder.reverse({ lat: latitude, lon: longitude });
        const geocoderResult = response[0];

        livelocation.push({
          type: 'Point',
          coordinates: [longitude, latitude],
          formattedAddress: geocoderResult.formattedAddress,
          country: geocoderResult.country,
          city: geocoderResult.city,
          state: geocoderResult.state,
          zipcode: geocoderResult.zipcode,
          streetName: geocoderResult.streetName,
          neighbourhood: geocoderResult.neighbourhood,
          provider: geocoderResult.provider
        });

        // console.log(livelocation);
        // const livelocation3 = {
        //   type: "Point",
        //   coordinates :  [longitude,latitude]
        // }
        // console.log(livelocation3, '3333333');
        let livelocation2 = {
          type: 'Point',
          coordinates: [longitude, latitude]
        };

      

        // Converting the data into String format
let stringdata = JSON.stringify(availableMenu)
// Print the QR code to terminal
QRCode.toString(stringdata,{type:'terminal'},
                    function (err, QRcode) {
    if(err) return console.log("error occurred")
    // Printing the generated code
    console.log(QRcode)
})
let MenuQR = "";
// Converting the data into base64
MenuQR = await QRCode.toDataURL(stringdata);

console.log(MenuQR,"qrcode ahi ye")

     const newStoreObject = {
          name, phonenumber, website, details, videourl, livelocation2,livelocation, storegallery: photoUrl2Value, storephoto: photoUrl1Value, status, storeownername, category: categoryId, subscriptionPlan: subscriptionPlanId,availableMenu,MenuQR
        };

        store = new Store(newStoreObject);

        // Push the livelocation to the store schema
        store.livelocation = livelocation;

        await Category.findByIdAndUpdate(categoryId, { $push: { stores: store._id } }, { new: true });

        const subscriptionPlan = await Subscription.findById(subscriptionPlanId);
        const expirationDate = new Date();
        console.log(expirationDate)
        let ress = expirationDate.setDate(expirationDate.getDate() + subscriptionPlan.validityDays);
        console.log("fafafafaff", ress);
        const subscriptionobj = {
          subscriptionplanId: subscriptionPlan._id,
          subscriptionPrice: subscriptionPlan.subprice,
          subscriptionDetails: subscriptionPlan.Details,
          subscriptionImage: subscriptionPlan.subimage,
          subscriptionName: subscriptionPlan.subname,
          validityDays: expirationDate.toISOString(),
        };

        if (!subscriptionPlan) {
          return next(new ErrorHandler("Invalid subscription plan", 400));
        }

        store.subscriptionPlanData.push(subscriptionobj);

        const currentDate = new Date();
        const timeDifference = expirationDate.getTime() - currentDate.getTime();
        console.log(timeDifference)

        if (timeDifference > 0) {
          setTimeout(async () => {
            await Store.findByIdAndUpdate(store._id, { $unset: { subscriptionPlanData: 1 } });
          }, timeDifference);
        }

        await store.save();

        res.status(201).json({
          success: true,
          message: "Store added successfully",
          store,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error retrieving live location data",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "You are not authenticated",
      });
    }

  });
});




export const checkousubscription = catchAsyncError(async (req, res, next)  => {
  const storeId = req.params.id;
  const store = await Store.findById(storeId);
  if (!store) {
    return next(new ErrorHandler('Store not found', 404));
  }
  const options = {
    amount: store.subscriptionPlanData[0].subscriptionPrice * 100,
     // Amount in paise (e.g., for ₹10, amount = 1000)
    currency: 'INR',
    // receipt: stor, // Unique identifier for the transaction
    payment_capture: 1, // Auto-capture the payment,
  };
  console.log(options)
  try {
    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Razorpay order',
    });
  }
});







//payment verification subscription plan 
export const paymentVerificationofSubscription = catchAsyncError(async(req,res,next)=>{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  req.body;

const body = razorpay_order_id + "|" + razorpay_payment_id;

const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
  .update(body.toString())
  .digest("hex");

const isAuthentic = expectedSignature === razorpay_signature;
if (isAuthentic) {
  await SubscriptionModel.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  res.redirect(
    `https://demo7.progressiveaidata.in/paymentsuccess?reference=${razorpay_payment_id}`
  );
} else {
  res.status(400).json({
    success: false,
  });
}
})



  // export const GetAllStores  = catchAsyncError(async (req, res, next) => {
  //   console.log(req.user, 'user');
  //   var validate;
  //   var length1 = req.user.permission.length;
  //   console.log(length1, 'length');
  //   // var validate;
  //   for (var i = 0; i < length1; i++) {
  
  //     var b = req.user.permission[i];
  //     var c = { readAny: "store" }
  
  //     console.log(JSON.stringify(c), 'cccccc')
  
  //     console.log(JSON.stringify(b), 'bbbbbbbbb')
  
  //     if (JSON.stringify(c) === JSON.stringify(b))
  //   {   validate = req.user.permission[i];
  
  //     console.log(req.user.permission[i], 'iiii')
  //     console.log(validate, 'validate')
  //   }
  
  
  //   }
  //   if ( validate != undefined || req.user.role == "admin") {
  //     const resultPerPage =5;
  //     const storeCount = await Store.countDocuments();
  //     const apiFeature = new ApiFeatures(Store.find().populate("category","categoryname"),req.query).search().filter().pagination(resultPerPage);
  //     let stores = await apiFeature.query;
  //     res.status(200).json({
  //       success: true,
  //       stores,
  //       storeCount,
  //       resultPerPage
  //     });
  //   }
  //   else{
  //     res.status(400).json({
  //       success:false,
  //       message:"you do not have access reachOut admin for more"
  //     })
  //   }
    
  // });

export const GetAllStores = catchAsyncError(async (req, res, next) => {
    // Check if req.user is not set, i.e., user is not logged in
    if (!req.user) {
      // Handle the case when the user is not logged in
      const resultPerPage = 5;
      const storeCount = await Store.countDocuments();
      const apiFeature = new ApiFeatures(
        Store.find().populate("category", "categoryname"),
        req.query
      ).search().filter().pagination(resultPerPage);
      let stores = await apiFeature.query;
  
      return res.status(200).json({
        success: true,
        stores,
        storeCount,
        resultPerPage,
      });
    }
  
    // If the user is logged in, proceed with permission check
    var validate;
    var length1 = req.user.permission.length;
  
    // ... (rest of the existing code) ...
  
    if (validate != undefined || req.user.role == "admin") {
      const resultPerPage = 5;
      const storeCount = await Store.countDocuments();
      const apiFeature = new ApiFeatures(
        Store.find().populate("category", "categoryname"),
        req.query
      ).search().filter().pagination(resultPerPage);
      let stores = await apiFeature.query;
      res.status(200).json({
        success: true,
        stores,
        storeCount,
        resultPerPage,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "you do not have access reachOut admin for more",
      });
    }
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
  console.log(req.user, 'user');
  var validate;
  var length1 = req.user.permission.length;
  console.log(length1, 'length');
  // var validate;
  for (var i = 0; i < length1; i++) {

    var b = req.user.permission[i];
    var c = { deleteAny: "event" }

    console.log(JSON.stringify(c), 'cccccc')

    console.log(JSON.stringify(b), 'bbbbbbbbb')

    if (JSON.stringify(c) === JSON.stringify(b))
  {   validate = req.user.permission[i];

    console.log(req.user.permission[i], 'iiii')
    console.log(validate, 'validate')
  }

  }
  if (validate != undefined || req.user.role == "admin") {

    const store = await Store.findById(storeId);
    if (!store) return next(new ErrorHandler("Store not found", 404));
    await store.deleteOne();
    res.status(200).json({
      success: true,
      message: "Store Deleted Successfully",
    });
  }
  else {
    res.status(400).json({
      success: false,
      message: "you are not authenticated"
    })
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
  // export const UpdateStore = catchAsyncError(async (req, res, next) => {
  //   const storeId = req.params.id;
  // console.log(req.user, 'user');
  // var validate;
  // var length1 = req.user.permission.length;
  // console.log(length1, 'length');
  // // var validate;
  // for (var i = 0; i < length1; i++) {

  //   var b = req.user.permission[i];
  //   var c = { deleteAny: "event" }

  //   console.log(JSON.stringify(c), 'cccccc')

  //   console.log(JSON.stringify(b), 'bbbbbbbbb')

  //   if (JSON.stringify(c) === JSON.stringify(b))
  // {   validate = req.user.permission[i];

  //   console.log(req.user.permission[i], 'iiii')
  //   console.log(validate, 'validate')
  // }



  // }
  //   storeupload(req, res, async (err) => {
  //     if (err) {
  //       return next(new ErrorHandler("Failed to update image"));
  //     }
  //     if ( validate != undefined || req.user.role == "admin") {
  //       const {
  //         name,
  //         category,
  //         phonenumber,
  //         website,
  //         details,
  //         videourl,
  //         latitude,
  //         longitude,
  //         status,
  //         storeownername,
  //         availableMenu
  //       } = req.body;
  //       console.log(name);
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
  //       if (availableMenu) {
  //         if(availableMenu.items) updates.availableMenu.items = items;
  //         if(availableMenu.price) updates.availableMenu.price = price;
  //         let stringdata = JSON.stringify(availableMenu)
  //         let MenuQR = "";
  //         // Converting the data into base64
  //         MenuQR = await QRCode.toDataURL(stringdata);
  //         updates.MenuQR = MenuQR;
  //         updates.availableMenu = availableMenu;
  //       } 

  //       if (req.files['storephoto']) {
  //         const photoUrl1Value = req.files['storephoto'][0].location;
  //         updates.storephoto = photoUrl1Value;
  //       }
    
  //       if (req.files['storegallery']) {
  //         const photoUrl2Value = req.files['storegallery'][0].location;
  //         updates.storegallery = photoUrl2Value;
  //       }
       
  //         const store = await Store.findById(storeId);
  //         if (!store) {
  //           return next(new ErrorHandler("Store not found"));
  //         }
  //         if (updates.storephoto && store.storephoto) {
  //           await deleteFromS3(store.storephoto);
  //         }
  //         if (updates.storegallery && store.storegallery) {
  //           await deleteFromS3(store.storegallery);
  //         }
    
  //         Object.assign(store, updates);
  //         await store.save();
  //         res.status(200).json({
  //           success: true,
  //           message: "Store updated successfully",
  //           store
  //         });
  //     }
  //     else {
  //       res.status(400).json({
  //         success: false,
  //         message: "you are not authenticated"
  //       })
  //     }
   
  
  //   });
  // });
  
  // export const UpdateStore = catchAsyncError(async (req, res, next) => {
  //   const storeId = req.params.id;
  //   console.log(req.user, 'user');

  //   var validate;
  //   var length1 = req.user.permission.length;
  //   console.log(length1, 'length');
  
  //   for (var i = 0; i < length1; i++) {
  //     var b = req.user.permission[i];
  //     var c = { deleteAny: "event" }
  
  //     console.log(JSON.stringify(c), 'cccccc')
  //     console.log(JSON.stringify(b), 'bbbbbbbbb')
  
  //     if (JSON.stringify(c) === JSON.stringify(b)) {
  //       validate = req.user.permission[i];
  //       console.log(req.user.permission[i], 'iiii')
  //       console.log(validate, 'validate')
  //     }
  //   }
  
  //   storeupload(req, res, async (err) => {
  //     if (err) {
  //       return next(new ErrorHandler("Failed to update image"));
  //     }
  
  //     if (validate !== undefined || req.user.role === "admin") {
  //       const {
  //         name,
  //         category,
  //         phonenumber,
  //         website,
  //         details,
  //         videourl,
  //         latitude,
  //         longitude,
  //         status,
  //         storeownername,
  //         availableMenu
  //       } = req.body;
  // console.log(req.body, 'req.body');
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
  
  //       if (availableMenu) {
  //         const { items, price } = availableMenu;
  //         const existingStore = await Store.findById(storeId);
  
  //         if (existingStore && existingStore.availableMenu) {
  //           // for(var i = 0; i < existingStore.availableMenu.length; i++){
  //           //     console.log(existingStore.availableMenu[i]);
  //           // }
  //           // if(existingStore.availableMenu[i])
  //           if (items) {
  //             existingStore.availableMenu.items = items;
  //             updates['availableMenu.items'] = items;
  //           }
  //           if (price) {
  //             existingStore.availableMenu.price = price;
  //             updates['availableMenu.price'] = price;
  //           }
  
  //           let stringData = JSON.stringify(existingStore.availableMenu);
  //           let menuQR = await QRCode.toDataURL(stringData);
  //           updates.MenuQR = menuQR;
  //         }
  //       }
  
  //       if (req.files['storephoto']) {
  //         const photoUrl1Value = req.files['storephoto'][0].location;
  //         updates.storephoto = photoUrl1Value;
  //       }
  
  //       if (req.files['storegallery']) {
  //         const photoUrl2Value = req.files['storegallery'][0].location;
  //         updates.storegallery = photoUrl2Value;
  //       }
  
  //       const store = await Store.findById(storeId);
  //       if (!store) {
  //         return next(new ErrorHandler("Store not found"));
  //       }
  
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
  //     } else {
  //       res.status(400).json({
  //         success: false,
  //         message: "You are not authenticated"
  //       });
  //     }
  //   });
  // });
  export const UpdateStore = catchAsyncError(async (req, res, next) => {
    const storeId = req.params.id;
    console.log(req.user, 'user');
  
    var validate;
    var length1 = req.user.permission.length;
    console.log(length1, 'length');
  
    for (var i = 0; i < length1; i++) {
      var b = req.user.permission[i];
      var c = { deleteAny: "event" }
  
      console.log(JSON.stringify(c), 'cccccc')
      console.log(JSON.stringify(b), 'bbbbbbbbb')
  
      if (JSON.stringify(c) === JSON.stringify(b)) {
        validate = req.user.permission[i];
        console.log(req.user.permission[i], 'iiii')
        console.log(validate, 'validate')
      }
    }
  
    storeupload(req, res, async (err) => {
      if (err) {
        return next(new ErrorHandler("Failed to update image"));
      }
  
      if (validate !== undefined || req.user.role === "admin") {
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
          storeownername,
          availableMenu
        } = req.body;
        console.log(req.body, 'req.body');
  
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
  
        if (availableMenu) {
          const { items, price } = availableMenu;
          const existingStore = await Store.findById(storeId);
  
          if (existingStore && existingStore.availableMenu) {
            // Find the index of the object you want to update
            const index = existingStore.availableMenu.findIndex(obj => obj._id === availableMenu._id);
            console.log(index, 'index');
            if (index !== -1) {
              // Create a new object with the updated properties
              const updatedObject = {};
              if (items) updatedObject.items = items;
              if (price) updatedObject.price = price;
  
              // Replace the object at the specific index
              existingStore.availableMenu[index] = { ...existingStore.availableMenu[index], ...updatedObject };
         console.log(availableMenu,'menu');
              updates.availableMenu = existingStore.availableMenu;
           console.log(updates.availableMenu, 'menu1')
              // Generate the new QR code
              let stringData = JSON.stringify(existingStore.availableMenu);
              let menuQR = await QRCode.toDataURL(stringData);
              updates.MenuQR = menuQR;
            }
          }
        }
  
        if (req.files['storephoto']) {
          const photoUrl1Value = req.files['storephoto'][0].location;
          updates.storephoto = photoUrl1Value;
        }
  
        if (req.files['storegallery']) {
          const photoUrl2Value = req.files['storegallery'][0].location;
          updates.storegallery = photoUrl2Value;
        }
  
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
      } else {
        res.status(400).json({
          success: false,
          message: "You are not authenticated"
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


//Store Subscription apis starts here  
export const subscriptionPlanForMerchant = catchAsyncError(async(req,res,next)=>{
subscriptionUpload(req, res, async (err) => {
  if (err)
    return next(new ErrorHandler("failed to upload image try again later"))
    const{subname,subprice,Details,validityDays} = req.body;
    if(!subname||!subprice)
    return next(new ErrorHandler("Please enter all field", 400));
    let subscription = await Subscription.findOne({ subname });
    if (subscription) return next(new ErrorHandler("Subscription Already Exist", 409));
    const subavatar = req.file.location;
subscription = await Subscription.create({
    subname,
    subprice,
    subimage: subavatar,
    Details,
    validityDays
    
  })
  await subscription.save();
  res.status(201).json({
    success:true,
    message:"subscription added successfully",
    subscription
  })
});
})


//edit subscription plan 
export const updateSubscription = catchAsyncError(async (req, res, next) => {
  const subscriptionId = req.params.id;
subscriptionUpload(req, res, async (err) => {
  if (err)
    return next(new ErrorHandler("failed to update image"))
  const {subname,Details,subprice,validityDays} = req.body;
  const updates = {};
  if (subname) {
    updates.subname = subname;
  }
  if (Details) {
    updates.Details = Details;
  }
  if (subprice) {
    updates.subprice = subprice;
  }
  if (validityDays) {
    updates.validityDays = validityDays;
  }
  if (req.file) {
    const photoUrlValue = req.file.location;
    updates.subimage = photoUrlValue;
  }
  try{
    const subscription = await Subscription.findById(subscriptionId);        
    if(!subscription)
    return next(new ErrorHandler("subscription not found"));
    if (updates.subimage && subscription.subimage) {
      await deleteFromS3(subscription.subimage);
    }
      Object.assign(subscription, updates);
      await subscription.save();
      res.status(200).json({
        success:true,
        message:"subscription update successfully",
        subscription,
      })
    
  }catch(err){
    res.status(500).json({
      success:false,
      message:"failed to update subscription",
      error:err.message,
    })
  }
});
});

//get all subscription 
export const getallSubscription = catchAsyncError(async(req,res,next)=>{
  const subscription = await Subscription.find();
  res.status(200).json({
    success:true,
    message:"Getting all the subscription",
    subscription
  })
})

//get subscription byID
export const getallSubscriptionById= catchAsyncError(async(req,res,next)=>{
  const subscription = await Subscription.findById(req.params.id);
  if(!subscription)
  return next(new ErrorHandler("failed to get subscription"))
  res.status(200).json({
    success:true,
    message:"Getting the subscription",
    subscription
  })
})

//delete the subscriptionById 
export const deleteSubscription= catchAsyncError(async(req,res,next)=>{
  const subscription = await Subscription.findById(req.params.id);
  if(!subscription)
  return next(new ErrorHandler("failed to delete the subscription"));
  await subscription.deleteOne();
  res.status(200).json({
    success:true,
    message:"Subscription deleted successfully"
  })
})


//mobile user apisss started here 


export const getNearByResturenttoUser = catchAsyncError(async (req, res, next) => {
  const { latitude, longitude } = req.body;

  let options = {
    provider: 'openstreetmap'
  };

  let geoCoder = nodeGeocoder(options);
  const response = await geoCoder.reverse({ lat: latitude, lon: longitude });
  const geocoderResult = response[0];
  console.log(geocoderResult);

  const cityFind = await Store.find({});

  let avalableResutrentInCity = [];

  for (var i = 0; i < cityFind.length; i++) {
    console.log(cityFind[i].livelocation[0].city, 'city');
    if (cityFind[i].livelocation[0].city === geocoderResult.city) {
      avalableResutrentInCity.push(cityFind[i]);
    } else {
      console.log("false");
    }
  }

  res.status(200).json({
    success: true,
    message: "Getting cities",
    avalableResutrentInCity,
  });
}
);


export const getResByDistance = catchAsyncError(async (req, res, next) => {
  const { latitude, longitude, distance } = req.body;
  console.log(req.body, "req.body");

  const storeFind = await Store.find({
    livelocation2: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: distance,
      },
    },
  });
if(storeFind.length===0) return next(new ErrorHandler("No resturent findNearby"))

res.status(200).json({
  success:true,
  message:"NearBYResturent",
  storeFind,
})
});


export const getNearByResturenttoUserByRating = catchAsyncError(async(req,res,next)=>{

  const { latitude, longitude, distance ,rating} = req.body;
  console.log(req.body, "req.body");

  const storeFind = await Store.find({
    ratings: {$gte:rating},
    livelocation2: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
        },
        $maxDistance: distance,
      },
    },
  });
if(storeFind.length===0) return next(new ErrorHandler("No resturent findNearby"))

res.status(200).json({
  success:true,
  message:"NearBYResturent",
  storeFind,
})

})


export const searchStore = async(req,res)=>{
  try {
    const { categoryName } = req.query;

    // Find the category by name
    const category = await Category.findOne({ categoryname: categoryName });

    if (!category) {   
      return res.status(404).json({ message: 'Category not found' });
    }

    // Find stores with matching category
    const stores = await Store.find({ category: category._id });

    res.json({ stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const SearchOnlyStore = async(req,res)=>{

  try {
    const { storeName } = req.query;
  
    // Perform case-insensitive search for stores with matching name
    const stores = await Store.find({ name: { $regex: storeName, $options: 'i' } });
  
    res.json({ stores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }

}  



