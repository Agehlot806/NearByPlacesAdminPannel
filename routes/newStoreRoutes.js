import express from "express";
import { AddnewStore, DeleteStore, GetAllStores, UpdateStore, createStoreReviews, getStoreReview,deleteReview, getStoreBYId, GetAllStoresRecentAdded, getAllStoreReviews, subscriptionPlanForMerchant, getallSubscription, updateSubscription, getallSubscriptionById, deleteSubscription,paymentVerificationofSubscription,checkousubscription, getNearByResturenttoUser, getResByDistance, getNearByResturenttoUserByRating} from "../controllers/managestoreController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/addnewstore/:categoryId/stores").post(isAuthenticated,AddnewStore);
router.route("/checkoutss/:id").post(checkousubscription)
router.route("/subscriptionverification").post(paymentVerificationofSubscription);
router.route("/allstores").get(isAuthenticated,GetAllStores);
router.route("/stores/:id").delete(isAuthenticated,DeleteStore).put(isAuthenticated,UpdateStore);
router.route("/review").put(isAuthenticated, createStoreReviews);
router.route("/reviews").get(getStoreReview);
router.route("/allstores/:id").get(getStoreBYId)
router.route("/allstorerev").get(GetAllStoresRecentAdded);
router.route("/allreview").get(getAllStoreReviews)
router.route("/addsubscriptionplan").post(subscriptionPlanForMerchant)
router.route("/getallsubscription").get(getallSubscription);
router.route("/updatesubscription/:id").put(updateSubscription)
router.route("/getallsubscription/:id").get(getallSubscriptionById)
router.route("/subscription/:id").delete(deleteSubscription)
router.route("/getnearstore").post(getNearByResturenttoUser);
router.route('/getResByDist').post(getResByDistance);
router.route('/getResbByDisandRating').post(getNearByResturenttoUserByRating);











// ResetPassword
export default router;
