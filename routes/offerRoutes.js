import express from "express";
import { AddnewOffer, GetallOffers } from "../controllers/offerController.js";
import {isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.route("/createnewoffer").post(singleUpload,AddnewOffer);
router.route("/alloffers").get(GetallOffers);
export default router; 