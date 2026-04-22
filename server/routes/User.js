import express from "express";
import {
  UserLogin,
  UserRegister,
  addToCart,
  addToFavorites,
  forgotPassword,
  getAllCartItems,
  getAllOrders,
  getUserFavourites,
  placeOrder,
  removeFromCart,
  removeFromFavorites,
  resetPassword,
  verifyResetToken,
  getUserInfo,
  updateUserInfo,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Auth routes
router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

// Password reset routes
router.post("/forgot-password", forgotPassword);
router.get("/verify-reset-token/:token", verifyResetToken);
router.post("/reset-password/:token", resetPassword);

//cart
router.get("/cart", verifyToken, getAllCartItems);
router.post("/cart", verifyToken, addToCart);
router.patch("/cart", verifyToken, removeFromCart);

//order
router.get("/order", verifyToken, getAllOrders);
router.post("/order", verifyToken, placeOrder);

//favourites
router.get("/favorite", verifyToken, getUserFavourites);
router.post("/favorite", verifyToken, addToFavorites);
router.patch("/favorite", verifyToken, removeFromFavorites);

// Profile
router.get("/info", verifyToken, getUserInfo);
router.patch("/update", verifyToken, updateUserInfo);

export default router;
