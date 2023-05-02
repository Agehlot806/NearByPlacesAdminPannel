import express from "express";
import { createTable, updateTable ,deleteTable, updatetableAvailability, gettable, gettables} from "../controllers/tableController.js";
const router = express.Router();
router.route("/createtable/:storeId").post(createTable);
router.route("/updatetable/:id").put(updateTable);
router.route("/tables/:id/:storeId").delete(deleteTable);
router.route("/tables/availability/:id").put(updatetableAvailability);
router.route("/tables/:id").get(gettable);
router.route("/alltables").get(gettables);



export default router; 