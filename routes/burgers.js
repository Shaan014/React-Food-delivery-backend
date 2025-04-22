// routes/burgerRoutes.js
const express = require('express');
const router = express.Router();
const Burger = require('../models/Burger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET all burgers
router.get('/', async (req, res) => {
  try {
    const burgers = await Burger.find();
    res.json(burgers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching burgers', error: err.message });
  }
});

// GET a single burger by ID
router.get('/:id', async (req, res) => {
  try {
    const burger = await Burger.findById(req.params.id);
    if (!burger) {
      return res.status(404).json({ message: 'Burger not found' });
    }
    res.json(burger);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching burger', error: err.message });
  }
});

// POST create a burger with an image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const burgerData = req.body;
    if (req.file) {
      burgerData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const newBurger = new Burger(burgerData);
    await newBurger.save();
    res.status(201).json({ message: 'Burger created successfully', burger: newBurger });
  } catch (err) {
    res.status(500).json({ message: 'Error saving burger', error: err.message });
  }
});

// PUT update a burger with an image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const burgerData = req.body;

    if (req.file) {
      burgerData.imageUrl = `/uploads/${req.file.filename}`;

      // Delete old image if new image is uploaded
      const existing = await Burger.findById(req.params.id);
      if (existing?.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existing.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedBurger = await Burger.findByIdAndUpdate(req.params.id, burgerData, { new: true });
    res.json({ message: 'Burger updated', updatedBurger });
  } catch (err) {
    res.status(500).json({ message: 'Error updating burger', error: err.message });
  }
});

// DELETE a burger
router.delete('/:id', async (req, res) => {
  try {
    const burger = await Burger.findByIdAndDelete(req.params.id);
    if (burger?.imageUrl) {
      const imagePath = path.join(__dirname, '..', burger.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete image file from the file system
      }
    }
    res.json({ message: 'Burger deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting burger', error: err.message });
  }
});

module.exports = router;


