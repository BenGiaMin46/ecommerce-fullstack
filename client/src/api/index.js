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

export const addProductAdmin = async (token, data) =>
  await API.post(`/products/add`, [data], {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProductAdmin = async (token, id, data) =>
  await API.patch(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteProductAdmin = async (token, id) =>
  await API.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Promotions & News
export const getPromotions = async () => await API.get("/promo-news/promotions");
export const addPromotion = async (token, data) =>
  await API.post("/promo-news/promotions", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updatePromotion = async (token, id, data) =>
  await API.patch(`/promo-news/promotions/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deletePromotion = async (token, id) =>
  await API.delete(`/promo-news/promotions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getNews = async () => await API.get("/promo-news/news");
export const addNews = async (token, data) =>
  await API.post("/promo-news/news", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const updateNews = async (token, id, data) =>
  await API.patch(`/promo-news/news/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
export const deleteNews = async (token, id) =>
  await API.delete(`/promo-news/news/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

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
