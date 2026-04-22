import express from "express";
import { 
    getDashboardStats, 
    getAllOrdersAdmin, 
    updateOrderStatus, 
    getAllUsersAdmin, 
    toggleAdminStatus 
} from "../controllers/Admin.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// All routes here are protected by verifyAdmin
router.get("/stats", verifyAdmin, getDashboardStats);
router.get("/orders", verifyAdmin, getAllOrdersAdmin);
router.patch("/orders/:id/status", verifyAdmin, updateOrderStatus);
router.get("/users", verifyAdmin, getAllUsersAdmin);
router.patch("/users/:id/role", verifyAdmin, toggleAdminStatus);

export default router;
