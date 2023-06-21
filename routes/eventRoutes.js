import express from "express";
import { AddnewEvent,permissongive, permissiontake,DeleteEventById, GetAllEvents, UpdateEvent, addparticipantToEvent, deleteparticipantfromEvent, getEventById ,getallEventParticipants} from "../controllers/eventController.js";
import {isAuthenticated, specificauth } from "../middlewares/auth.js";
import { authorizeAdmin } from "../middlewares/auth.js";
const router = express.Router();
router.route("/createevent").post(isAuthenticated, AddnewEvent);
router.route('/allevents').get(isAuthenticated,GetAllEvents);
router.route("/allevent/:id").get(getEventById);
router.route("/events/:id").put(isAuthenticated,authorizeAdmin,UpdateEvent).delete(isAuthenticated,DeleteEventById);
router.route("/addparticipanttoevent").put(isAuthenticated,addparticipantToEvent);
router.route("/allparticipant").get(getallEventParticipants);
router.route("/allparticipant").delete(isAuthenticated,deleteparticipantfromEvent);

router.route("/permissongive").post(isAuthenticated, permissongive);
router.route("/permissiontake").post(isAuthenticated,permissiontake);

export default router; 
