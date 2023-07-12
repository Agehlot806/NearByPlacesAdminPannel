import express from "express";
import { createTable, updateTable ,deleteTable,getAllTables, updatetableStatus, getTable, getAllTablesofAllStore} from "../controllers/tableController.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();
router.route("/createtable/:storeId").post(isAuthenticated,createTable);
router.route("/updatetablestatus/:id").put(updatetableStatus);
router.route("/updatetable/:storeId/tables/:tableId").put(isAuthenticated,updateTable);
router.route("/table/:storeId/tables/:tableId").delete(isAuthenticated,deleteTable);
router.route("/table/:storeId").get(getAllTables);
router.route("/table/:storeId/table/:tableId").get(isAuthenticated,getTable);
router.route("/alltables").get(isAuthenticated,getAllTablesofAllStore);


export default router;