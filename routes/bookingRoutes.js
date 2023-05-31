import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { NewBooking } from "../controllers/bookingController.js";
const router  = express.Router();
router.route("/booking/new").post(isAuthenticated,NewBooking);


export default router;