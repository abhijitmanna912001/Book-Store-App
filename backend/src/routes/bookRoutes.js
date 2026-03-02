import express from "express";
import cloudinaryClient from "../lib/cloudinary.js";
import protectRoute from "../middleware/auth.middleware.js";
import Book from "../models/Book.js";

const router = express.Router();

router.post("", protectRoute, async (req, res) => {
  try {
    const { title, caption, rating, image } = req.body;

    if (!image || !title || !caption || !rating)
      return res.status(400).json({ message: "All fields are required" });

    const uploadRes = await cloudinaryClient.uploader.upload(image);
    const imageUrl = uploadRes.secure_url;

    const newBook = new Book({
      title,
      caption,
      rating,
      image: imageUrl,
      user: req.user._id,
    });

    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
