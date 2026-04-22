import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String }, // Optional detailed content
    image: { type: String, required: true },
    category: { type: String, required: true }, // Collection, Event, Fashion, etc.
    date: { type: String, required: true }, // Format: "MM/DD/YYYY"
    readTime: { type: String, default: "3 min read" },
  },
  { timestamps: true }
);

export default mongoose.model("News", NewsSchema);
