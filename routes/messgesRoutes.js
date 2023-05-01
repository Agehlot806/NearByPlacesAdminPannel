import express from "express";
import { getallmessages, sendMessage } from "../controllers/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/sendmessage").post(isAuthenticated,sendMessage);
router.route("/getallmessages").get(getallmessages);

export default router;