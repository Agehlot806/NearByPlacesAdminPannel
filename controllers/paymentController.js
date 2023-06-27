import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {instance} from "../server.js"
import crypto from "crypto"
import { Booking } from "../models/Booking.js";
import { PaymentModel } from "../models/PaymentModel.js";
import { BookingModelDataModel } from "../models/BookingModelDataModel.js";
import { BookingTable } from "../models/BookingTable.js";
export const checkout = catchAsyncError(async (req, res, next)  => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId);
  // console.log(booking)
  if (!booking) {
    return next(new ErrorHandler('Booking not found', 404));
  }
  const options = {
    amount: booking.table_price * 100, // Amount in paise (e.g., for ₹10, amount = 1000)
    currency: 'INR',
    receipt: booking._id +333,
    payment_capture: 1, // Auto-capture the payment
  };
  try {
    const order = await instance.orders.create(options);
    const orderData = new BookingModelDataModel({
      id: order.id,
      entity: order.entity,
      amount: order.amount,
      amount_paid: order.amount_paid,
      amount_due: order.amount_due,
      currency: order.currency,
      receipt: order.receipt,
      offer_id: order.offer_id,
      status: order.status,
      attempts: order.attempts,
      notes: order.notes,
      created_at: order.created_at,
    });
    await orderData.save();
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
export const paymentVerification = catchAsyncError(async(req,res,next)=>{
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  req.body;
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
  .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
  .update(body.toString())
  .digest("hex");
const isAuthentic = expectedSignature === razorpay_signature;
if (isAuthentic) {
  await PaymentModel.create({
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
export const changeBookingStatusfunc = catchAsyncError(async(req,res,next)=>{
const razorpayOrderId = req.params.id;
const orderdata = await PaymentModel.findOne({razorpay_order_id:razorpayOrderId});
console.log(orderdata);
if(orderdata){
const updateStatus = await Booking.findByIdAndUpdate(req.body.bookingId, {BookingStatus : "Confirmed"  });
const finalres = await updateStatus.save();
console.log(updateStatus, 'status');
res.status(200).json({
  message: "Booking Status updated Successfully",
  finalres,
})
}
else {
  res.status(500).json({
    message: "Please do Payment first to confirmed your booking"
  })
}
})
export const getallorders = catchAsyncError(async (req, res, next) => {
  try {
    const orders = await instance.orders.all();
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error retrieving orders from Razorpay:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders from Razorpay',
    });
  }
});
export const fetchSingleOrder = catchAsyncError(async(req,res,next)=>{
  try {
    const orderId = req.params.id;
    const orders = await instance.orders.fetch(orderId);
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error retrieving orders from Razorpay:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders from Razorpay',
    });
  }
})
export const fetachpaymentforOrders = catchAsyncError(async (req, res, next) => {
  try {
    const orderId = req.params.id
    const paymentOrders = await instance.orders.fetchPayments(orderId)
    res.status(200).json({
      success: true,
      paymentOrders,
    });
  } catch (error) {
    console.error('Error retrieving orders from Razorpay:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders from Razorpay',
    });
  }
});