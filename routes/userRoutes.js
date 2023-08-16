import express from "express";
import {verify_Register,PhoneOtp_Register,PhoneOtp_Login,getUserDetailsByOtpId,login,verify_Login,getMyProfile,Banner,logout,registerAdmin,registerUser, updateProfile,updatePassword,forgetPassword,resetPassword, testapi, updateUserRole, getallusers, SendNotification, merchantRegister, sendEmailtoAll, getUserfavoriateResturent, removeUserFavoriteRestaurant, countUserLikedRestaurants} from "../controllers/adminController.js";
import {authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import passport from "../utils/strategy.js";
import { getGraphData } from "../controllers/dashboardController.js";
// import passport from "passport";
const router = express.Router();
// router.route("/registeradmin").post(registerUser);
router.route("/PhoneOtp_Login").post(PhoneOtp_Login);
router.route("/verify_Login").post(verify_Login);
router.route("/registerUser/:otpId").post(registerUser);
router.route("/PhoneOtp_Register").post(PhoneOtp_Register);
router.route("/verify_Register").post(verify_Register);
router.get("/users/:otpId", getUserDetailsByOtpId);
router.route("/login").post(login);
router.route("/banner").get(Banner);
router.route("/registeradmin").post(registerAdmin);
router.route("/logout").get(logout);
router.route("/myprofile/:id").get(isAuthenticated,getMyProfile);
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
