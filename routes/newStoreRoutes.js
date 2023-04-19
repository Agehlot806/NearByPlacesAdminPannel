import express from "express";
import { AddnewStore } from "../controllers/managestoreController.js";
import { isAuthenticated ,authorizeAdmin} from "../middlewares/auth.js";
import { storeUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/addnewstore").post(isAuthenticated,authorizeAdmin,storeUpload,AddnewStore);
// ResetPassword
export default router;