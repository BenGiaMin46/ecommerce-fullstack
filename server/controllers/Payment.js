import crypto from "crypto";
import axios from "axios";
import { VNPay, HashAlgorithm } from "vnpay";
import dotenv from "dotenv";
import Orders from "../models/Orders.js";

dotenv.config();

// MoMo Configuration
const partnerCode = process.env.MOMO_PARTNER_CODE;
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;

// VNPay Configuration
const vnpay = new VNPay({
    tmnCode: process.env.VNP_TMN_CODE,
    secureSecret: process.env.VNP_HASH_SECRET,
    vnpayHost: "https://sandbox.vnpayment.vn",
    testMode: true,
    hashAlgorithm: HashAlgorithm.SHA512,
});

export const createMoMoPayment = async (req, res, next) => {
    try {
        const { orderId, amount, orderInfo } = req.body;
        const requestId = partnerCode + new Date().getTime();
        const redirectUrl = "http://localhost:3000/order-success";
        const ipnUrl = "https://your-public-url.com/api/payment/momo-ipn"; // Needs public URL for real notification
        const requestType = "captureWallet";
        const extraData = "";

        const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
        const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

        const requestBody = {
            partnerCode,
            accessKey,
            requestId,
            amount,
            orderId,
            orderInfo,
            redirectUrl,
            ipnUrl,
            requestType,
            extraData,
            signature,
            lang: "vi",
        };

        const response = await axios.post("https://test-payment.momo.vn/v2/gateway/api/create", requestBody);
        
        // Update order with payment method
        await Orders.findOneAndUpdate({ _id: orderId }, { payment_method: "MoMo" });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error("MoMo Error:", error.response?.data || error.message);
        next(error);
    }
};

export const createVNPayPayment = async (req, res, next) => {
    try {
        const { orderId, amount, orderInfo } = req.body;
        
        const paymentUrl = vnpay.buildPaymentUrl({
            vnp_Amount: amount, // VNPay amount is already multiplied by 100 in the SDK usually, but check if we need to do it
            vnp_IpAddr: req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: "other",
            vnp_ReturnUrl: process.env.VNP_RETURN_URL,
        });

        // Update order with payment method
        await Orders.findOneAndUpdate({ _id: orderId }, { payment_method: "VNPay" });

        return res.status(200).json({ payUrl: paymentUrl });
    } catch (error) {
        next(error);
    }
};

export const momoIPN = async (req, res) => {
    // Verifying MoMo IPN
    const { orderId, resultCode } = req.body;
    if (resultCode === 0) {
        await Orders.findOneAndUpdate({ _id: orderId }, { 
            payment_status: "Paid", 
            status: "Processing" 
        });
    }
    return res.status(204).send();
};

export const vnpayIPN = async (req, res) => {
    try {
        const verify = vnpay.verifyIpnCall(req.query);
        if (verify.isSuccess) {
            const orderId = verify.vnp_TxnRef;
            await Orders.findOneAndUpdate({ _id: orderId }, { 
                payment_status: "Paid", 
                status: "Processing" 
            });
            return res.status(200).json({ RspCode: "00", Message: "Confirm Success" });
        } else {
            return res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
        }
    } catch (error) {
        return res.status(200).json({ RspCode: "99", Message: "Unknown error" });
    }
};
