import express from "express";
import { AddnewOffer, DeleteOffer, GetallOffers, UpdateOffer, UpdateOfferImage } from "../controllers/offerController.js";
import {isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();

router.route("/createnewoffer").post(singleUpload,AddnewOffer);
router.route("/alloffers").get(GetallOffers);
router.route("/offer/:id").put(UpdateOffer).delete(DeleteOffer);
router.route("/updateofferimage/:id").put(singleUpload,UpdateOfferImage)



export default router; 