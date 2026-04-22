import express from "express";
import { 
    createMoMoPayment, 
    createVNPayPayment, 
    momoIPN, 
    vnpayIPN 
} from "../controllers/Payment.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/momo", verifyToken, createMoMoPayment);
router.post("/vnpay", verifyToken, createVNPayPayment);

// IPN routes don't usually have verifyToken as they are called by the payment gateway servers
router.post("/momo-ipn", momoIPN);
router.get("/vnpay-ipn", vnpayIPN); // VNPay IPN is usually GET or POST, library handles it

export default router;
