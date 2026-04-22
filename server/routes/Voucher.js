import express from "express";
import { validateVoucher, seedVouchers } from "../controllers/Voucher.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/validate", verifyToken, validateVoucher);
router.post("/seed", seedVouchers); // Optional: helper endpoint to seed data

export default router;
