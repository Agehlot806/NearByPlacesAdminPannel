import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { NewBooking, getAllBookings, getSingleBooking, myBookings, updateBookingStatus } from "../controllers/bookingController.js";
const router  = express.Router();
router.route("/booking/new").post(isAuthenticated,NewBooking);
router.route("/booking/:id").get(isAuthenticated,getSingleBooking);
router.route("/booking/me").get(isAuthenticated,myBookings);
router.route("/admin/bookings").get(getAllBookings);
router.route("/booking/update").put(updateBookingStatus)


export default router;