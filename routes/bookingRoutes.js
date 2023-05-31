import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { NewBooking, getAllBookings, getSingleBooking, myBookings } from "../controllers/bookingController.js";
const router  = express.Router();
router.route("/booking/new").post(isAuthenticated,NewBooking);
router.route("/booking/:id").get(isAuthenticated,getSingleBooking);
router.route("/booking/me").get(isAuthenticated,myBookings);
router.route("/admin/bookings").get(getAllBookings);


export default router;