// *** Express route handler

// routes/pizza.js
const express = require('express');
const router = express.Router();
const Pizza = require('../models/Pizza');
const multer = require('multer'); // image uploader
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// getting the pizza  data

router.get('/', async (req, res) => {
  try {
    const pizza = await Pizza.find();
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pizza' , error: err.message });
  }
});

// get the pizza data by ID
router.get('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) return res.status(404).json({ message: 'Pizza not found' });
    res.json(pizza);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pizza', error: err.message });
  }
});

// Adding new pizza data

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const pizzaData = req.body;
    if (req.file) {
        pizzaData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const newPizza = new Pizza(pizzaData);
    await newPizza.save();
    res.status(201).json({ message: 'Pizza created successfully', pizza: newPizza });
  } catch (err) {
    res.status(500).json({ message: 'Error saving pizza', error: err.message });
  }
});

// Updating the existing pizza data

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const pizzaData = req.body;

    if (req.file) {
        pizzaData.imageUrl = `/uploads/${req.file.filename}`;

      const existing = await Pizza.findById(req.params.id);
      if (existing?.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existing.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedPizza = await Pizza.findByIdAndUpdate(req.params.id, pizzaData, { new: true });
    res.json({ message: 'Pizza updated', updatedPizza });
  } catch (err) {
    res.status(500).json({ message: 'Error updating pizza', error: err.message });
  }
});

// deleting the pizza data

router.delete('/:id', async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (pizza?.imageUrl) {
      const imagePath = path.join(__dirname, '..', pizza.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.json({ message: 'Pizza deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting pizza', error: err.message });
  }
});

module.exports = router;