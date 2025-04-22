const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// CartItem schema
const cartItemSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  category: String,
  price: Number,
  quantity: Number,
  toppings: [String],
  totalPrice: Number,
}, { timestamps: true });

const CartItem = mongoose.model('CartItem', cartItemSchema);

// POST /api/cart → Add item
router.post('/', async (req, res) => {
  try {
    const item = new CartItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/cart → Get all cart items
router.get('/', async (req, res) => {
  try {
    const items = await CartItem.find();
    // Ensure response is an array and return both items and total
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    res.json({ items: items || [], total }); // Handle the case where `items` is not an array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/cart/:id → Remove item
router.delete('/:id', async (req, res) => {
  try {
    await CartItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
