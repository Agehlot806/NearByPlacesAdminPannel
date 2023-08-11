import express from "express";
import {PhoneOtp,login,verify,getMyProfile,Banner,logout,registerAdmin,registerUser, updateProfile,updatePassword,forgetPassword,resetPassword, testapi, updateUserRole, getallusers, SendNotification, merchantRegister, sendEmailtoAll, getUserfavoriateResturent, removeUserFavoriteRestaurant, countUserLikedRestaurants} from "../controllers/adminController.js";
import {authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import passport from "../utils/strategy.js";
import { getGraphData } from "../controllers/dashboardController.js";
// import passport from "passport";
const router = express.Router();
// router.route("/registeradmin").post(registerUser);
router.route("/PhoneOtp").post(PhoneOtp);
router.route("/verify").post(verify);
router.route("/login").post(login);
router.route("/banner").get(Banner);
router.route("/registeradmin").post(registerAdmin);
router.route("/registerUser").post(registerUser);
router.route("/logout").get(logout);
router.route("/myprofile").get(isAuthenticated,getMyProfile);
router.route("/updateadminpassword").put(isAuthenticated,updatePassword);
router.route("/updateadminprofile/:id").put(isAuthenticated,updateProfile);
router.route("/forgetpassword").post(forgetPassword);
router.route("/testapi").post(testapi);
// ResetPassword
router.route("/resetpassword/:token").put(resetPassword);
router.route("/updateuserrole/:id").put(isAuthenticated,authorizeAdmin,updateUserRole);
router.route("/getallusers").get(getallusers);
router.route("/sendnotification").post(SendNotification);
router.route("/merchant/register").post(merchantRegister);
router.route("/sendemail").post(sendEmailtoAll);
router.route("/getgraphdata").get(getGraphData);
router.route("/getfavresturent").post(isAuthenticated,getUserfavoriateResturent);
router.route("/removeresturentfav").post(isAuthenticated,removeUserFavoriteRestaurant);
router.route("/getfavrescount").get(isAuthenticated,countUserLikedRestaurants);










export default router; 
