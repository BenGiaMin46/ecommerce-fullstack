import mongoose from "mongoose";
import Products from "../models/Products.js";
import { createError } from "../error.js";

export const addProducts = async (req, res, next) => {
  try {
    const productsData = req.body;

    if (!Array.isArray(productsData)) {
      return next(
        createError(400, "Invalid request. Expected an array of products")
      );
    }

    const createdproducts = [];

    for (const productInfo of productsData) {
      const { title, name, desc, img, price, sizes, category } = productInfo;

      const product = new Products({
        title,
        name,
        desc,
        img,
        price,
        sizes,
        category,
      });
      const createdproduct = await product.save();

      createdproducts.push(createdproduct);
    }

    return res
      .status(201)
      .json({ message: "Products added successfully", createdproducts });
  } catch (err) {
    next(err);
  }
};

export const getproducts = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, sizes, search } = req.query;
    sizes = sizes?.split(",");
    categories = categories?.split(",");

    const filter = {};

    if (categories && Array.isArray(categories)) {
      filter.category = { $in: categories }; // Match products in any of the specified categories
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};
      if (minPrice && !isNaN(parseFloat(minPrice))) {
        filter["price.org"]["$gte"] = parseFloat(minPrice);
      }
      if (maxPrice && !isNaN(parseFloat(maxPrice))) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice);
      }
      // If the object is still empty, remove it
      if (Object.keys(filter["price.org"]).length === 0) {
        delete filter["price.org"];
      }
    }

    if (sizes && Array.isArray(sizes)) {
      filter.sizes = { $in: sizes }; // Match products in any of the specified sizes
    }

    if (search) {
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } }, // Case-insensitive title search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }

    const products = await Products.find(filter);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return next(createError(400, "Invalid product ID"));
    }
    const product = await Products.findById(id);
    if (!product) {
      return next(createError(404, "Product not found"));
    }
    return res.status(200).json(product);
  } catch (err) {
    return next(err);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || !comment) {
      return next(createError(400, "Rating and comment are required"));
    }

    // Verify purchase
    const userOrders = await Orders.find({
      user: userId,
      "products.product": id,
      status: "Delivered",
    });

    if (userOrders.length === 0) {
      return next(createError(403, "Only verified buyers can leave a review after delivery."));
    }

    const product = await Products.findById(id);
    if (!product) return next(createError(404, "Product not found"));

    // Check if user already reviewed
    const existingReview = product.reviews.find(r => r.user.toString() === userId);
    if (existingReview) {
      return next(createError(400, "You have already reviewed this product."));
    }

    product.reviews.push({ user: userId, rating, comment });
    
    // Recalculate avgRating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.avgRating = totalRating / product.reviews.length;

    await product.save();

    return res.status(201).json({ message: "Review added successfully", reviews: product.reviews, avgRating: product.avgRating });
  } catch (err) {
    next(err);
  }
};
