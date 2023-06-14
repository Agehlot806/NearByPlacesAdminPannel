import express from "express";
import { DeleteCategory, GetcategorybyId, addnewCategory, getAllCategory, updateCategoryData } from "../controllers/applicationController.js";
import { CreateMangeMenu, DeleteCms, editcmsMenu, getallcmspages, getcmsbyId } from "../controllers/CmsController.js";
const router  = express.Router();
router.route("/addnewcategory").post(addnewCategory);
router.route("/allcategory").get(getAllCategory);
router.route("/allcategory/:id").delete(DeleteCategory).put(updateCategoryData)
router.route("/allcategory/:categoryId/stores").get(GetcategorybyId);
router.route("/createcms").post(CreateMangeMenu);
router.route("/managemenu/:id").put(editcmsMenu).delete(DeleteCms).get(getcmsbyId);
router.route("/getallcms").get(getallcmspages);




export default router;
