import express from "express";
import { AddnewEvent, DeleteEventById, GetAllEvents, UpdateEvent, UpdateEventImage, addparticipantToEvent, deleteparticipantfromEvent, getEventById ,getallEventParticipants} from "../controllers/eventController.js";
import {isAuthenticated } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
const router = express.Router();
router.route("/createevent").post(singleUpload,AddnewEvent);
router.route('/allevents').get(GetAllEvents);
router.route("/allevent/:id").get(getEventById);
router.route("/events/:id").put(UpdateEvent).delete(DeleteEventById);
router.route("/updateeventimage/:id").put(singleUpload,UpdateEventImage);
router.route("/addparticipanttoevent").put(isAuthenticated,addparticipantToEvent);
router.route("/allparticipant").get(getallEventParticipants);
router.route("/allparticipant").delete(isAuthenticated,deleteparticipantfromEvent);



export default router; 