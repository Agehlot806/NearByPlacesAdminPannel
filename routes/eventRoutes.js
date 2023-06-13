import express from "express";
import { AddnewEvent, DeleteEventById, GetAllEvents, UpdateEvent, addparticipantToEvent, deleteparticipantfromEvent, getEventById ,getallEventParticipants} from "../controllers/eventController.js";
import {isAuthenticated, specificauth } from "../middlewares/auth.js";
import { authorizeAdmin } from "../middlewares/auth.js";
const router = express.Router();
router.route("/createevent").post(AddnewEvent);
router.route('/allevents').get(isAuthenticated,authorizeAdmin,specificauth,GetAllEvents);
router.route("/allevent/:id").get(getEventById);
router.route("/events/:id").put(isAuthenticated,authorizeAdmin,UpdateEvent).delete(isAuthenticated,authorizeAdmin,DeleteEventById);
router.route("/addparticipanttoevent").put(isAuthenticated,addparticipantToEvent);
router.route("/allparticipant").get(getallEventParticipants);
router.route("/allparticipant").delete(isAuthenticated,deleteparticipantfromEvent);



export default router; 