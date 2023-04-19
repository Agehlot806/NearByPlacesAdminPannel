import express from "express";
import { AddnewStore, DeleteStore, GetAllStores, UpdateStore, UpdateStoreProfile } from "../controllers/managestoreController.js";
import { isAuthenticated ,authorizeAdmin} from "../middlewares/auth.js";
import { storeUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/addnewstore").post(isAuthenticated,authorizeAdmin,storeUpload,AddnewStore);
router.route("/allstores").get(GetAllStores);
router.route("/stores/:id").delete(DeleteStore).put(UpdateStore);
router.route("/updatestoreimage/:id").put(storeUpload,UpdateStoreProfile);
// ResetPassword
export default router;