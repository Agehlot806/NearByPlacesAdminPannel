import express from "express";
import {sendMessage,replyingMessage,getllmessage, sendpushNotification} from "../controllers/messageController.js";
const router = express.Router();

router.route("/sendmessage").post(sendMessage);
router.route("/allmessages").get(getllmessage);
router.route("/messages/:id/reply").post(replyingMessage);
router.route("/notification").post(sendpushNotification)
export default router;
