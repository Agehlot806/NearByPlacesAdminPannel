import express from "express";
import {AddUserFav, UnFavorite,GetUserFavorites} from "../controllers/favorite.js";

const router = express.Router();

router.route("/AddUserFav").post(AddUserFav);
router.route("/UnFavorite").delete(UnFavorite);
router.route("/getUserFav/:userId").get(GetUserFavorites);
export default router; 
