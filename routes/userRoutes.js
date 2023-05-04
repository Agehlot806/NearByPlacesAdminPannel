import express from "express";
import {registerUser,login,logout,getMyProfile, updateProfile,updatePassword,forgetPassword,resetPassword, testapi, updateadminprofilepicture, updateUserRole} from "../controllers/adminController.js";
import {authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/registeradmin").post(singleUpload,registerUser);
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
router.route("/updateuserrole/:id").put(isAuthenticated,authorizeAdmin,updateUserRole);


export default router; 