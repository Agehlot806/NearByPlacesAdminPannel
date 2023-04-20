import express from "express";
import {registeradmin,login,logout,getMyProfile, updateProfile,updatePassword,forgetPassword,resetPassword, testapi, updateadminprofilepicture} from "../controllers/adminController.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/registeradmin").post(singleUpload,registeradmin);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/myprofile").get(isAuthenticated,getMyProfile);
router.route("/updateadminpassword").put(isAuthenticated,updatePassword);
router.route("/updateadminprofile").put(isAuthenticated,updateProfile);
router.route("/updateadminprofilepicture/:id").put(singleUpload,isAuthenticated,updateadminprofilepicture);
router.route("/forgetpassword").post(forgetPassword);
router.route("/testapi").get(testapi);
// ResetPassword
router.route("/resetpassword/:token").put(resetPassword);


export default router; 