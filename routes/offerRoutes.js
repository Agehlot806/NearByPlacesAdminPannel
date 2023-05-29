import express from "express";
import { AddnewOffer, DeleteOffer, GetOfferById, GetallOffers, UpdateOffer } from "../controllers/offerController.js";
const router = express.Router();

router.route("/createnewoffer").post(AddnewOffer);
router.route("/alloffers").get(GetallOffers);
router.route("/offer/:id").put(UpdateOffer).delete(DeleteOffer);
router.route("/offers/:id").get(GetOfferById);




export default router; 