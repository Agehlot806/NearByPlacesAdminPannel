import express from "express";
import { ReservationCheckout } from "../controllers/ResevationController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/reservation-checkout/:id").post(isAuthenticated,ReservationCheckout);


export default router;