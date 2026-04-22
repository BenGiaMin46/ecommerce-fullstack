import express from "express";
import {
  getAllPromotions,
  addPromotion,
  updatePromotion,
  deletePromotion,
  getAllNews,
  addNews,
  updateNews,
  deleteNews,
} from "../controllers/PromotionsNews.js";
import { verifyAdmin } from "../middleware/verifyToken.js";

const router = express.Router();

// Promotions routes
router.get("/promotions", getAllPromotions); // Public for website
router.post("/promotions", verifyAdmin, addPromotion);
router.patch("/promotions/:id", verifyAdmin, updatePromotion);
router.delete("/promotions/:id", verifyAdmin, deletePromotion);

// News routes
router.get("/news", getAllNews); // Public for website
router.post("/news", verifyAdmin, addNews);
router.patch("/news/:id", verifyAdmin, updateNews);
router.delete("/news/:id", verifyAdmin, deleteNews);

export default router;
