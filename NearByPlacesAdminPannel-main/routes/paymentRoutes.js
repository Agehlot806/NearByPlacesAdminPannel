import express from "express";
import { changeBookingStatusfunc, checkout,fetachpaymentforOrders,fetchSingleOrder,getallorders,paymentVerification } from "../controllers/paymentController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/checkout/:id").post(isAuthenticated,checkout);

router.route("/paymentverification").post(isAuthenticated,paymentVerification);
router.route("/getallorders").get(getallorders)
router.route("/orders/:id/payments").get(fetachpaymentforOrders)
router.route("/orders/:id").get(fetchSingleOrder)
router.route("/updatebookingstatus/:id").get(changeBookingStatusfunc)

export default router;