import express from "express";
import { AddnewChef, Getallchef,Getsinglechef,Addchefspec,updateChef,deleteChef } from "../controllers/chefController.js";
const router  = express.Router();


router.route('/addnewchef/:id').post(AddnewChef);
router.route('/getallchef').get(Getallchef);
router.route('/singlechef/:id').get(Getsinglechef);
router.route('/addchefspec/:id').post(Addchefspec);
router.route('/updatechef/:id').put(updateChef);
router.route('/deletechef/:id').delete(deleteChef);
export default router;