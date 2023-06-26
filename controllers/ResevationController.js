import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Reservation } from "../models/Reservation.js";
import { Event } from "../models/Event.js";
import {instance} from "../server.js"
import { User } from "../models/User.js";
import crypto from "crypto";

export const ReservationCheckout = catchAsyncError(async (req, res, next)  => {
    const eventId = req.params.id;
    const userId = req.user ? req.user._id : null;
    const event = await Event.findById(eventId);
    if (!event) {
      return next(new ErrorHandler('Event not found', 404));
    }
    const userParticipated = event.usersparticipated.find(participant => String(participant.user) === String(userId));
  console.log(userParticipated);
  if (!userParticipated) {
    return next(new ErrorHandler('User is not a participant in the event', 403));
  }
  const reservationId = Date.now().toString() + Math.floor(Math.random() * 1000);


    const ticketCount = event.usersparticipated[0].ticketCount; // Assuming the ticket count is stored in the Event model
    console.log(ticketCount)
    const totalAmount = event.EventPrice * ticketCount * 100;
    console.log(totalAmount)
    const options = {
      amount:totalAmount, // Amount in paise (e.g., for ₹10, amount = 1000)
      currency: 'INR',
      receipt: 1, // Unique identifier for the transaction
      payment_capture: 1, // Auto-capture the payment,
      notes: {
        type: 'reservation', // Custom metadata field for reservation
        reservationId
      },
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


export const paymentVerificationofReservation = catchAsyncError(async(req,res,next)=>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");
  
  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
    await Reservation.create({
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



  export const getallordersofReservation = catchAsyncError(async (req, res, next) => {
    try {
      const ordersResponse = await instance.orders.all();
      const orders = ordersResponse.items || [];
      console.log(orders)
  
      // Filter orders based on notes.type
      const filteredOrders = orders.filter(order => order.notes && order.notes.type === 'reservation');
  
      res.status(200).json({
        success: true,
        orders: filteredOrders,
      });
    } catch (error) {
      console.error('Error retrieving orders from Razorpay:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve orders from Razorpay',
      });
    }
  });
  
  
