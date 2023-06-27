import express from "express";
import { ReservationCancellation, ReservationCheckout, getallordersofReservation, getallrefundstats, paymentVerificationofReservation } from "../controllers/ResevationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/reservation-checkout/:id").post(isAuthenticated,ReservationCheckout);
router.route("/paymentverificationofreservation").post(paymentVerificationofReservation);
router.route("/getallreservation").get(getallordersofReservation)
router.route("/cancelledreservation/:id").post(ReservationCancellation);
router.route("/getrefunddata/:id").get(getallrefundstats);




export default router;
