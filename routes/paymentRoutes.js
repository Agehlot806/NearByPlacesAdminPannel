import express from "express";
import { checkout,fetachpaymentforOrders,getallorders,paymentVerification } from "../controllers/paymentController.js";

const router = express.Router();

router.route("/checkout/:id").post(checkout);

router.route("/paymentverification").post(paymentVerification);
router.route("/getallorders").get(getallorders)
router.route("/paymentForOrder/:id").get(fetachpaymentforOrders)
export default router;