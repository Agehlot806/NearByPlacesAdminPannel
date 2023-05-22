import express from "express";
import { addnewCategory, getAllCategory } from "../controllers/applicationController.js";
import { categoryUpload } from "../middlewares/multer.js";
const router  = express.Router();
router.route("/addnewcategory").post(categoryUpload,addnewCategory);
router.route("/allcategory").get(getAllCategory);
export default router;
