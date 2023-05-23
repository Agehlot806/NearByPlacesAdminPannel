import express from "express";
import {sendMessage,replyingMessage} from "../controllers/messageController.js";
const router = express.Router();

router.route("/sendmessage").post(sendMessage);
router.route("/messages/:id/reply").post(replyingMessage);
export default router;
