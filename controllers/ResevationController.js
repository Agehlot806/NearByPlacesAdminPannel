import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { Reservation } from "../models/Reservation.js";
import { Event } from "../models/Event.js";
import {instance} from "../server.js"
import { User } from "../models/User.js";
import crypto from "crypto";
import { Reservationpayment } from "../models/ResevationpaymentModel.js";
  
export const ReservationCheckout = catchAsyncError(async (req, res, next) => {
  const eventId = req.params.id;
  const userId = req.user ? req.user._id : null;
  const event = await Event.findById(eventId);
  if (!event) {
    return next(new ErrorHandler('Event not found', 404));
  }
  const userParticipated = event.usersparticipated.find(
    (participant) => String(participant.user) === String(userId)
  );
  console.log(userParticipated);
  if (!userParticipated) {
    return next(
      new ErrorHandler('User is not a participant in the event', 403)
    );
  }
  const reservationId = Date.now().toString() + Math.floor(Math.random() * 1000);

  const ticketCount = userParticipated.ticketCount;
  console.log(ticketCount);
  const totalAmount = event.EventPrice * ticketCount * 100;
  console.log(totalAmount);
  const options = {
    amount: totalAmount,
    currency: 'INR',
    receipt: 1,
    payment_capture: 1,
    notes: {
      type: 'reservation',
      reservationId,
    },
  };
  console.log(options);

  try {
    const order = await instance.orders.create(options);

    const reservation = new Reservation({
      eventId: eventId,
      userId: userId,
      reservationId: reservationId,
      ticketCount: ticketCount,
      amount: totalAmount,
      currency: options.currency,
      receipt: options.receipt,
      status: order.status,
      notes: options.notes,
      created_at: Math.floor(Date.now() / 1000), // Converting to seconds
    });

    await reservation.save();

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


export const ReservationCancellation = catchAsyncError(async (req, res, next) => {
  const { reservationId } = req.body;
  const { id: razorpay_order_id } = req.params;

  try {
    // Fetch the reservation from the database
    const reservation = await Reservationpayment.findOne({ razorpay_order_id });

    if (!reservation) {
      return next(new ErrorHandler('Reservation not found', 404));
    }

    // Retrieve the full reservation data based on the reservationId
    const reservationData = await Reservation.findOne({ reservationId });

    if (!reservationData) {
      return next(new ErrorHandler('Reservation not found', 404));
    }

    // Make a refund request to Razorpay
    const refund = await instance.payments.refund(reservation.razorpay_payment_id);

    // Update the reservation status in the database
    reservationData.status = 'cancelled';
    await reservationData.save();

    // Update the user's account balance or any other necessary actions

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled and refund processed successfully',
      refundAmount: refund.amount / 100, // Convert refund amount from paise to currency
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
    });       
  }
});





export const paymentVerificationofReservation = catchAsyncError(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;
  if (isAuthentic) {
   await Reservationpayment.create({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
   })

    res.redirect(`https://demo7.progressiveaidata.in/paymentsuccess?reference=${razorpay_payment_id}`);
  } else {
    res.status(400).json({
      success: false,
    });
  }
});


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
  
  
