import express from "express";
import { AddnewOffer, DeleteOffer, GetallOffers, UpdateOffer, UpdateOfferImage } from "../controllers/offerController.js";
import {isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/createnewoffer").post(AddnewOffer);
router.route("/alloffers").get(GetallOffers);
router.route("/offer/:id").put(UpdateOffer).delete(DeleteOffer);
router.route("/updateofferimage/:id").put(UpdateOfferImage)



export default router; 