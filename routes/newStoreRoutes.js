import express from "express";
import { AddnewStore, DeleteStore, GetAllStores, UpdateStore, UpdateStoreProfile, createStoreReview, getStoreReview } from "../controllers/managestoreController.js";
import { isAuthenticated ,authorizeAdmin} from "../middlewares/auth.js";
import { storeUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/addnewstore").post(isAuthenticated,authorizeAdmin,storeUpload,AddnewStore);
router.route("/allstores").get(GetAllStores);
router.route("/stores/:id").delete(DeleteStore).put(UpdateStore);
router.route("/updatestoreimage/:id").put(storeUpload,UpdateStoreProfile);
router.route("/review").put(isAuthenticated, createStoreReview);
router.route("/reviews").get(getStoreReview);
// ResetPassword
export default router;