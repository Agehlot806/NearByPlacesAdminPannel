import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Order } from "../models/PaymentModel.js";
// import { Product } from "../models/product.js";
import { Store } from "../models/Stores.js";
import { Store } from "../models/Stores.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { stripe } from "../server.js";

export const processPayment = catchAsyncError(async (req, res, next) => {
  const { totalAmount } = req.body;
  const { client_secret } = await stripe.paymentIntents.create({
    amount: Number(totalAmount * 100),
    currency: "inr",
  });
  res.status(200).json({
    success: true,
    client_secret,
  });
});

export const createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalAmount,
  } = req.body;

  await Order.create({
    user: req.user._id,
    orderItems,
    paymentMethod,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalAmount,
  });

  for (let i = 0; i < orderItems.length; i++) {
    const store = await Store.findById(orderItems[i].store);
    await store.save();
  }
  res.status(201).json({
    success: true,
    message: "Order Placed Successfully",
  });
});

export const getAdminOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({});
  res.status(200).json({
    success: true,
    orders,
  });
});

export const getMyOrders = catchAsyncError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    orders,
  });
});

export const getOrderDetails = catchAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));
  res.status(200).json({
    success: true,
    order,
  });
});

// export const proccessOrder = asyncError(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);
//   if (!order) return next(new ErrorHandler("Order Not Found", 404));

//   if (order.orderStatus === "Preparing") order.orderStatus = "Shipped";
//   else if (order.orderStatus === "Shipped") {
//     order.orderStatus = "Delivered";
//     order.deliveredAt = new Date(Date.now());
//   } else return next(new ErrorHandler("Order Already Delivered", 400));

//   await order.save();

//   res.status(200).json({
//     success: true,
//     message: "Order Processed Successfully",
//   });
// });