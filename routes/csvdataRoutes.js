import express from "express";
import { Eventcsvdata, Messagescsvdata, Offercsvdata, SingleEventCsvData, SingleOfferCsvData, SingleStoreCsvData, SingleUserCsvData, Storecsvdata, usercsvdata } from "../controllers/csvdataController.js";
const router = express.Router();
router.route("/getusercsvdata").get(usercsvdata);
router.route('/getstorecsvdata').get(Storecsvdata);
router.route('/getoffercsvdata').get(Offercsvdata);
router.route("/geteventscsvdata").get(Eventcsvdata);
router.route("/getallusermessagescsvdata").get(Messagescsvdata)
//single csv data routes 
router.route("/getusercsvdata/:id").get(SingleUserCsvData);
router.route("/getstorecsvdata/:id").get(SingleStoreCsvData);
router.route("/getoffercsvdata/:id").get(SingleOfferCsvData)
router.route('/geteventscsvdata/:id').get(SingleEventCsvData);



export default router; 