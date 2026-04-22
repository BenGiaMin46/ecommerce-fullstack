import Promotions from "../models/Promotions.js";
import News from "../models/News.js";
import { createError } from "../error.js";

// Promotions Controllers
export const getAllPromotions = async (req, res, next) => {
  try {
    const promos = await Promotions.find().sort({ createdAt: -1 });
    res.status(200).json(promos);
  } catch (err) {
    next(err);
  }
};

export const addPromotion = async (req, res, next) => {
  try {
    const newPromo = new Promotions(req.body);
    const savedPromo = await newPromo.save();
    res.status(201).json(savedPromo);
  } catch (err) {
    next(err);
  }
};

export const updatePromotion = async (req, res, next) => {
  try {
    const updatedPromo = await Promotions.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedPromo);
  } catch (err) {
    next(err);
  }
};

export const deletePromotion = async (req, res, next) => {
  try {
    await Promotions.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Promotion deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// News Controllers
export const getAllNews = async (req, res, next) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.status(200).json(news);
  } catch (err) {
    next(err);
  }
};

export const addNews = async (req, res, next) => {
  try {
    const newNews = new News(req.body);
    const savedNews = await newNews.save();
    res.status(201).json(savedNews);
  } catch (err) {
    next(err);
  }
};

export const updateNews = async (req, res, next) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedNews);
  } catch (err) {
    next(err);
  }
};

export const deleteNews = async (req, res, next) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "News deleted successfully" });
  } catch (err) {
    next(err);
  }
};
