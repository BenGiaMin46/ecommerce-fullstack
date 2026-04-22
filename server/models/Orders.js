import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: { type: mongoose.Schema.Types.ObjectId, ref: "Products" },
          quantity: { type: Number, default: 1 },
        },
      ],
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total_amount: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    payment_method: {
      type: String,
      default: "COD",
    },
    payment_status: {
      type: String,
      default: "Pending",
    },
    status: {
      type: String,
      default: "Pending",
    },
    discount_amount: {
      type: mongoose.Types.Decimal128,
      default: 0,
    },
    voucher_code: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Shopping-Orders", OrdersSchema);
