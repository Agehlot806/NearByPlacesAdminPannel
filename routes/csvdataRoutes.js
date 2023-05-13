import express from "express";
import { Eventcsvdata, Offercsvdata, Storecsvdata, usercsvdata } from "../controllers/csvdataController.js";
const router = express.Router();
router.route("/getusercsvdata").get(usercsvdata);
router.route('/getstorecsvdata').get(Storecsvdata);
router.route('/getoffercsvdata').get(Offercsvdata);
router.route("/geteventscsvdata").get(Eventcsvdata);

export default router; 