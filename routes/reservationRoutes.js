import express from "express";
import { ReservationCheckout, getallordersofReservation, paymentVerificationofReservation } from "../controllers/ResevationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/reservation-checkout/:id").post(isAuthenticated,ReservationCheckout);
router.route("/paymentverificationofreservation").post(paymentVerificationofReservation);
router.route("/getallreservation").get(getallordersofReservation)


export default router;