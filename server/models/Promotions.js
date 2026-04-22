import mongoose from "mongoose";

const PromotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    badge: { type: String, required: true },
    date: { type: String, required: true }, // Format: "Expiry: MM/DD/YYYY" or "Every Sat-Sun"
    category: { type: String, default: "all" }, // all, new, sale
  },
  { timestamps: true }
);

export default mongoose.model("Promotions", PromotionSchema);
