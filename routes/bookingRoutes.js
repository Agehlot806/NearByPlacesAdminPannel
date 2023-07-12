import express from "express";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { NewBookingUser,deletebooking,getAllBookings, getAllBookingsAllStore, getBooking, getUserBookings } from "../controllers/bookingController.js";


const router  = express.Router();
router.route("/newbooking/:storeId/table/:tableId").post(isAuthenticated,NewBookingUser);
router.route("/allbooking/:storeId").get(isAuthenticated,authorizeAdmin,getAllBookings);
router.route("/mybooking").get(isAuthenticated,getUserBookings);
router.route("/getbooking/:storeId/:bookingId").get(isAuthenticated,getBooking);
router.route("/allbookings").get(isAuthenticated,getAllBookingsAllStore);
router.route("/deletebooking/:bookingId").delete(isAuthenticated,deletebooking);













export default router;