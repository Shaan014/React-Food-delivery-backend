const express = require('express');
const router = express.Router();
const Drinks = require('../models/drinks');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// 🟢 GET all drinks
router.get('/', async (req, res) => {
  try {
    const drinks = await Drinks.find();
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drinks', error: err.message });
  }
});


// 🟢 GET a single drink by ID
router.get('/:id', async (req, res) => {
  try {
    const drinks = await Drinks.findById(req.params.id);
    if (!drinks) return res.status(404).json({ message: 'drinks not found' });
    res.json(drinks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching drinks', error: err.message });
  }
});


// 🟢 POST - Add new drink
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const drinksData = req.body;

    if (req.file) {
      drinksData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const newDrinks = new Drinks(drinksData);
    await newDrinks.save();

    res.status(201).json({ message: 'Drinks created successfully', drinks: newDrinks });
  } catch (err) {
    res.status(500).json({ message: 'Error saving drinks', error: err.message });
  }
});


// 🟡 PUT - Update existing drink
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const drinksData = req.body;

    if (req.file) {
      drinksData.imageUrl = `/uploads/${req.file.filename}`;

      // Delete the old image if exists
      const existing = await Drinks.findById(req.params.id);
      if (existing?.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existing.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedDrinks = await Drinks.findByIdAndUpdate(req.params.id, drinksData, { new: true });

    res.json({ message: 'drinks updated', updatedDrinks });
  } catch (err) {
    res.status(500).json({ message: 'Error updating drinks', error: err.message });
  }
});


// 🔴 DELETE - Remove a drink
router.delete('/:id', async (req, res) => {
  try {
    const drinks = await Drinks.findByIdAndDelete(req.params.id);

    if (drinks?.imageUrl) {
      const imagePath = path.join(__dirname, '..', drinks.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'drinks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting drinks', error: err.message });
  }
});

module.exports = router;
