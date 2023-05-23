import express from "express";
import {sendMessage,replyingMessage,getllmessage} from "../controllers/messageController.js";
const router = express.Router();

router.route("/sendmessage").post(sendMessage);
router.route("/allmessages").get(getllmessage);
router.route("/messages/:id/reply").post(replyingMessage);
export default router;
