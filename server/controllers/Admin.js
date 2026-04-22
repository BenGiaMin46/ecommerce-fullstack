import User from "../models/User.js";
import Orders from "../models/Orders.js";
import Products from "../models/Products.js";
import { createError } from "../error.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Products.countDocuments();
    const allOrders = await Orders.find();
    const totalOrders = allOrders.length;
    
    // Calculate total revenue
    const totalRevenue = allOrders.reduce((sum, order) => {
      // payment_status should be 'Paid' or 'Success' for revenue, but for summary let's take all
      return sum + parseFloat(order.total_amount.toString());
    }, 0);

    // Revenue by month (for charts)
    const monthlyRevenue = await Orders.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: { $toDouble: "$total_amount" } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Top selling products
    const topProducts = await Orders.aggregate([
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          count: { $sum: "$products.quantity" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" }
    ]);

    return res.status(200).json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue.toFixed(2),
      monthlyRevenue,
      topProducts
    });
  } catch (err) {
    next(err);
  }
};

export const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Orders.find()
      .populate("user", "name email")
      .populate("products.product")
      .sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      return next(createError(400, "Invalid status"));
    }

    const order = await Orders.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!order) return next(createError(404, "Order not found"));
    
    return res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    next(err);
  }
};

export const getAllUsersAdmin = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const toggleAdminStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(createError(404, "User not found"));
    
    user.isAdmin = !user.isAdmin;
    await user.save();
    
    return res.status(200).json({ message: "User role updated", isAdmin: user.isAdmin });
  } catch (err) {
    next(err);
  }
};
