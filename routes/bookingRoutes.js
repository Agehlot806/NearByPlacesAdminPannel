import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { DeleteBooking, NewBooking, getAllBookings, getSingleBooking, myBookings, updateBookingStatus, BookingCancellation } from "../controllers/bookingController.js";
const router  = express.Router();
router.route("/booking/new").post(isAuthenticated,NewBooking);
router.route("/booking/:id").get(getSingleBooking);
router.route("/booking/me").get(isAuthenticated,myBookings);
router.route("/admin/bookings").get(getAllBookings);
router.route("/booking/update").put(updateBookingStatus);
router.route("/booking/:id").delete(isAuthenticated,DeleteBooking);

router.route("/cancelledbooking/:id").post(BookingCancellation)
export default router;