import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080/api/",
});

export const UserSignUp = async (data) => await API.post("/user/signup", data);
export const UserSignIn = async (data) => await API.post("/user/signin", data);

// Password Reset
export const requestPasswordReset = async (data) => await API.post("/user/forgot-password", data);
export const resetPassword = async (token, data) => await API.post(`/user/reset-password/${token}`, data);
export const verifyResetToken = async (token) => await API.get(`/user/verify-reset-token/${token}`);

// Profiling
export const getUserInfo = async (token) =>
  await API.get(`/user/info`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateUserInfo = async (token, data) =>
  await API.patch(`/user/info`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Reviews
export const addReview = async (token, id, data) =>
  await API.post(`/products/${id}/review`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Admin API
export const getAdminStats = async (token) =>
  await API.get(`/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllOrdersAdmin = async (token) =>
  await API.get(`/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateOrderStatusAdmin = async (token, id, status) =>
  await API.patch(`/admin/orders/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getAllUsersAdmin = async (token) =>
  await API.get(`/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Voucher
export const validateVoucher = async (token, data) =>
  await API.post(`/voucher/validate`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Products
export const getAllProducts = async (filter = "") =>
  await API.get(filter ? `/products?${filter}` : "/products");

export const getProductDetails = async (id) => await API.get(`/products/${id}`);

//Cart

export const getCart = async (token) =>
  await API.get("/user/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToCart = async (token, data) =>
  await API.post(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromCart = async (token, data) =>
  await API.patch(`/user/cart/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Favourites

export const getFavourite = async (token) =>
  await API.get(`/user/favorite`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const addToFavourite = async (token, data) =>
  await API.post(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFromFavourite = async (token, data) =>
  await API.patch(`/user/favorite/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

//Orders

export const placeOrder = async (token, data) =>
  await API.post(`/user/order/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOrders = async (token) =>
  await API.get(`/user/order/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Payment
export const createMoMoPayment = async (token, data) =>
  await API.post(`/payment/momo`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createVNPayPayment = async (token, data) =>
  await API.post(`/payment/vnpay`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
