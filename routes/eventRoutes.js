import express from "express";
import { AddnewEvent } from "../controllers/eventController.js";
import {isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/createevent").post(singleUpload,AddnewEvent);



export default router; 