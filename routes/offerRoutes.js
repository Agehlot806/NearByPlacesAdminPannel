import express from "express";
import { AddnewOffer, DeleteOffer, GetOfferById, GetallOffers, UpdateOffer } from "../controllers/offerController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

router.route("/createnewoffer").post(isAuthenticated,AddnewOffer);
router.route("/alloffers").get(GetallOffers);
router.route("/offer/:id").put(isAuthenticated,UpdateOffer).delete(isAuthenticated,DeleteOffer);
router.route("/offers/:id").get(GetOfferById);




export default router; 
