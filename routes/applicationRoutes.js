import express from "express";
import { DeleteCategory, GetcategorybyId, addnewCategory, getAllCategory, updateCategoryData } from "../controllers/applicationController.js";
import { categoryUpload } from "../middlewares/multer.js";
const router  = express.Router();
router.route("/addnewcategory").post(categoryUpload,addnewCategory);
router.route("/allcategory").get(getAllCategory);
router.route("/allcategory/:id").delete(DeleteCategory).put(updateCategoryData)
router.route("/allcategory/:categoryId/stores").get(GetcategorybyId);

export default router;
