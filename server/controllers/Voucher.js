import Voucher from "../models/Voucher.js";
import { createError } from "../error.js";

export const validateVoucher = async (req, res, next) => {
  try {
    const { code, orderAmount } = req.body;
    const userJWT = req.user;
    
    const voucher = await Voucher.findOne({ code: code.toUpperCase() });
    
    if (!voucher) {
      return next(createError(404, "Voucher code not found"));
    }
    
    if (!voucher.isActive) {
      return next(createError(400, "Voucher is inactive"));
    }
    
    if (new Date() > voucher.expiryDate) {
      return next(createError(400, "Voucher has expired"));
    }
    
    if (orderAmount < voucher.minOrderAmount) {
      return next(createError(400, `Minimum order amount of $${voucher.minOrderAmount} required`));
    }
    
    // Check if user has already used this voucher
    if (voucher.usedBy.includes(userJWT.id)) {
      return next(createError(400, "You have already used this voucher"));
    }
    
    let discountAmount = 0;
    if (voucher.discountType === "PERCENTAGE") {
      discountAmount = (orderAmount * voucher.discountValue) / 100;
    } else {
      discountAmount = voucher.discountValue;
    }
    
    return res.status(200).json({
      message: "Voucher applied successfully",
      discountAmount,
      code: voucher.code,
    });
  } catch (err) {
    next(err);
  }
};

// Seeding standard vouchers for testing
export const seedVouchers = async (req, res, next) => {
  try {
    const vouchers = [
      {
        code: "WELCOME10",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderAmount: 50,
        expiryDate: new Date("2026-12-31"),
      },
      {
        code: "PROMO50",
        discountType: "FIXED",
        discountValue: 50,
        minOrderAmount: 200,
        expiryDate: new Date("2026-12-31"),
      }
    ];
    
    await Voucher.insertMany(vouchers);
    return res.status(201).json({ message: "Vouchers seeded successfully" });
  } catch (err) {
    next(err);
  }
};
