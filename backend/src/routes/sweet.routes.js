const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const Sweet = require("../models/Sweet");

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  const { name, category, price, quantity } = req.body;

  await Sweet.create({
    name,
    category,
    price,
    quantity
  });

  return res.status(201).json({
    message: "Sweet added successfully"
  });
});

router.get("/", authMiddleware, async (req, res) => {
  const sweets = await Sweet.find();
  return res.status(200).json(sweets);
});

router.get("/search", authMiddleware, async (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;

  let query = {};

  if (name) {
    query.name = { $regex: name, $options: "i" };
  }

  if (category) {
    query.category = { $regex: category, $options: "i" };
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(query);
  return res.status(200).json(sweets);
});

router.put("/:id", authMiddleware, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  const { id } = req.params;
  const updates = req.body;

  await Sweet.findByIdAndUpdate(id, updates);

  return res.status(200).json({
    message: "Sweet updated successfully"
  });
});

router.delete("/:id", authMiddleware, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  const { id } = req.params;

  await Sweet.findByIdAndDelete(id);

  return res.status(200).json({
    message: "Sweet deleted successfully"
  });
});

router.post("/:id/purchase", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const sweet = await Sweet.findById(id);

  if (!sweet) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  if (sweet.quantity <= 0) {
    return res.status(400).json({ message: "Sweet out of stock" });
  }

  sweet.quantity -= 1;
  await sweet.save();

  return res.status(200).json({
    message: "Sweet purchased successfully"
  });
});

router.post("/:id/restock", authMiddleware, async (req, res) => {

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({
      message: "Invalid restock amount"
    });
  }

  const sweet = await Sweet.findById(id);

  if (!sweet) {
    return res.status(404).json({ message: "Sweet not found" });
  }

  sweet.quantity += amount;
  await sweet.save();

  return res.status(200).json({
    message: "Sweet restocked successfully"
  });
});





module.exports = router;
