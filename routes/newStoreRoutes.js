import express from "express";
import { AddnewStore, DeleteStore, GetAllStores, UpdateStore, UpdateStoreProfile, createStoreReviews, getStoreReview,deleteReview, getStoreBYId } from "../controllers/managestoreController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { storeUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/addnewstore").post(isAuthenticated,storeUpload,AddnewStore);
router.route("/allstores").get(GetAllStores);
router.route("/stores/:id").delete(DeleteStore).put(UpdateStore);
router.route("/updatestoreimage/:id").put(storeUpload,UpdateStoreProfile);
router.route("/review").put(isAuthenticated, createStoreReviews);
router.route("/reviews").get(getStoreReview);
router.route("/allstores/:id").get(getStoreBYId)
// ResetPassword
export default router;