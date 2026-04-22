import express from "express";
import {
  addProducts,
  getProductById,
  getproducts,
  addReview,
} from "../controllers/Products.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add", addProducts);
router.get("/", getproducts);
router.get("/:id", getProductById);
router.post("/:id/review", verifyToken, addReview);

export default router;
