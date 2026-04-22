import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { createError } from "../error.js";
import User from "../models/User.js";
import Orders from "../models/Orders.js";
import Voucher from "../models/Voucher.js";
import { sendPasswordResetEmail, sendWelcomeEmail, sendOrderConfirmationEmail } from "../utils/emailService.js";

dotenv.config();

// Generate secure random token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

//user register controller
export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError(400, "Invalid email format"));
    }
    
    // Validate password strength
    if (password.length < 8) {
      return next(createError(400, "Password must be at least 8 characters long"));
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(createError(409, "Email is already in use"));
    }
    
    const salt = bcrypt.genSaltSync(10);
    const hashedpassword = bcrypt.hashSync(password, salt);

    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedpassword,
      img,
    });
    
    const createduser = await user.save();
    
    // Send welcome email (async, don't wait)
    sendWelcomeEmail(createduser.email, createduser.name).catch(err => {
      console.error("Failed to send welcome email:", err);
    });
    
    const token = jwt.sign({ id: createduser._id, isAdmin: createduser.isAdmin }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    
    return res.status(201).json({ token, user: createduser });
  } catch (error) {
    return next(error);
  }
};

//user login controller
export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError(400, "Invalid email format"));
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (!existingUser) {
      return next(createError(404, "User not found"));
    }

    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password"));
    }
    
    const token = jwt.sign({ id: existingUser._id, isAdmin: existingUser.isAdmin }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    
    return res.status(200).json({ token, user: existingUser });
  } catch (error) {
    return next(error);
  }
};

// Forgot Password - Request reset link
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(createError(404, "No account found with this email address"));
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Save to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Send email
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      return res.status(200).json({ 
        message: "Password reset link sent to your email",
        email: user.email 
      });
    } catch (emailError) {
      // If email fails, clear the reset token
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      
      return next(createError(500, "Failed to send reset email. Please try again."));
    }
  } catch (error) {
    return next(error);
  }
};

// Verify reset token
export const verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return next(createError(400, "Invalid or expired reset token"));
    }
    
    return res.status(200).json({ 
      valid: true,
      message: "Token is valid",
      email: user.email 
    });
  } catch (error) {
    return next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    // Validate password
    if (!password || password.length < 8) {
      return next(createError(400, "Password must be at least 8 characters long"));
    }
    
    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return next(createError(400, "Invalid or expired reset token"));
    }
    
    // Hash new password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    
    // Generate new token for auto-login
    const authToken = jwt.sign({ id: user._id }, process.env.JWT, {
      expiresIn: "9999 years",
    });
    
    return res.status(200).json({
      message: "Password reset successful",
      token: authToken,
      user
    });
  } catch (error) {
    return next(error);
  }
};

// Cart
export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const existingCartItemIndex = user.cart.findIndex((item) =>
      item?.product?.equals(productId)
    );
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();

    return res
      .status(200)
      .json({ message: "Product added to cart successfully", user });
  } catch (err) {
    next(err);
  }
};

export const removeFromCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    const productIndex = user.cart.findIndex((item) =>
      item.product.equals(productId)
    );
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1);
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();
      return res
        .status(200)
        .json({ message: "Product quantity updated in cart", user });
    } else {
      return next(createError(404, "Product not found in the user's cart"));
    }
  } catch (err) {
    next(err);
  }
};

export const getAllCartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Products",
    });
    const cartItems = user.cart;
    return res.status(200).json(cartItems);
  } catch (err) {
    next(err);
  }
};

// Order

export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount, voucherCode, discountAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    
    // Check stock first
    for (const item of products) {
      const product = await Products.findById(item.product);
      if (!product) return next(createError(404, `Product ${item.product} not found`));
      if (product.stock < item.quantity) {
        return next(createError(400, `Not enough stock for ${product.title}. Available: ${product.stock}`));
      }
    }

    const order = new Orders({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
      voucher_code: voucherCode || null,
      discount_amount: discountAmount || 0,
    });
    const savedOrder = await order.save();

    // Deduct stock
    for (const item of products) {
      await Products.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // If a voucher was used, record the user in the voucher's usedBy list
    if (voucherCode) {
      await Voucher.findOneAndUpdate(
        { code: voucherCode.toUpperCase() },
        { $addToSet: { usedBy: user._id } }
      );
    }

    user.cart = [];
    await user.save();

    // Send order confirmation email (async)
    sendOrderConfirmationEmail(user.email, order, user.name).catch(err => {
      console.error("Failed to send order confirmation email:", err);
    });

    return res
      .status(200)
      .json({ message: "Order placed successfully", order });
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Orders.find({ user: user.id }).populate({
      path: "products.product",
      model: "Products",
    });
    return res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

// Password validation middleware
export const validatePasswordChange = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userJWT = req.user;
    
    const user = await User.findById(userJWT.id);
    if (!user) {
      return next(createError(404, "User not found"));
    }
    
    // Verify current password
    const isPasswordCorrect = bcrypt.compareSync(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Current password is incorrect"));
    }
    
    // Validate new password
    if (!newPassword || newPassword.length < 8) {
      return next(createError(400, "New password must be at least 8 characters"));
    }
    
    req.userToUpdate = user;
    next();
  } catch (error) {
    return next(error);
  }
};

//Favourite

export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    return res
      .status(200)
      .json({ message: "Product added to favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();
    return res
      .status(200)
      .json({ message: "Product removed from favorites successfully", user });
  } catch (err) {
    next(err);
  }
};

export const getUserFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();

    if (!user) {
      return next(createError(404, "User not found"));
    }

    return res.status(200).json(user.favourites);
  } catch (err) {
    next(err);
  }
};

// Profile
export const getUserInfo = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).select("-password");
    if (!user) {
      return next(createError(404, "User not found"));
    }
    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const { name, img } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      userJWT.id,
      { $set: { name, img } },
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }
    
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (err) {
    next(err);
  }
};
