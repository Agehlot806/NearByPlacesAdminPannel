import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import {instance} from "../server.js"
import crypto from "crypto"
import { Booking } from "../models/Booking.js";
import { PaymentModel } from "../models/PaymentModel.js";
export const checkout = catchAsyncError(async (req, res, next)  => {
  const bookingId = req.params.id;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    return next(new ErrorHandler('Booking not found', 404));
  }

  const options = {
    amount: booking.Tableprice * 100, // Amount in paise (e.g., for ₹10, amount = 1000)
    currency: 'INR',
    receipt: booking.bookingId, // Unique identifier for the transaction
    payment_capture: 1, // Auto-capture the payment,

  };

  try {
    const order = await instance.orders.create(options)
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
  // Database comes here

  await PaymentModel.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  res.redirect(
    `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
  );
} else {
  res.status(400).json({
    success: false,
  });
}
})