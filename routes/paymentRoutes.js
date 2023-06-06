import express from "express";
import { checkout,fetachpaymentforOrders,fetchSingleOrder,getallorders,paymentVerification } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/checkout/:id").post(checkout);

router.route("/paymentverification").post(paymentVerification);
router.route("/getallorders").get(getallorders)
router.route("/orders/:id/payments").get(fetachpaymentforOrders)
router.route("/orders/:id").get(fetchSingleOrder)
export default router;