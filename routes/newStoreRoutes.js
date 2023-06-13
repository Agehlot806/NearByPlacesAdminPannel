import express from "express";
import { AddnewStore, DeleteStore, GetAllStores, UpdateStore, createStoreReviews, getStoreReview,deleteReview, getStoreBYId, GetAllStoresRecentAdded, getAllStoreReviews} from "../controllers/managestoreController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/addnewstore/:categoryId/stores").post(isAuthenticated,AddnewStore);
router.route("/allstores").get(GetAllStores);
router.route("/stores/:id").delete(DeleteStore).put(UpdateStore);
router.route("/review").put(isAuthenticated, createStoreReviews);
router.route("/reviews").get(getStoreReview);
router.route("/allstores/:id").get(getStoreBYId)
router.route("/allstorerev").get(GetAllStoresRecentAdded);
router.route("/allreview").get(getAllStoreReviews)



// ResetPassword
export default router;