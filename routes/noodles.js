// routes/noodles.js
const express = require('express');
const router = express.Router();
const Noodle = require('../models/Noodle');
const multer = require('multer');
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

router.get('/', async (req, res) => {
  try {
    const noodles = await Noodle.find();
    res.json(noodles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching noodles', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const noodle = await Noodle.findById(req.params.id);
    if (!noodle) return res.status(404).json({ message: 'Noodle not found' });
    res.json(noodle);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching noodle', error: err.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const noodleData = req.body;
    if (req.file) {
      noodleData.imageUrl = `/uploads/${req.file.filename}`;
    }
    const newNoodle = new Noodle(noodleData);
    await newNoodle.save();
    res.status(201).json({ message: 'Noodle created successfully', noodle: newNoodle });
  } catch (err) {
    res.status(500).json({ message: 'Error saving noodle', error: err.message });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const noodleData = req.body;

    if (req.file) {
      noodleData.imageUrl = `/uploads/${req.file.filename}`;

      const existing = await Noodle.findById(req.params.id);
      if (existing?.imageUrl) {
        const oldImagePath = path.join(__dirname, '..', existing.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedNoodle = await Noodle.findByIdAndUpdate(req.params.id, noodleData, { new: true });
    res.json({ message: 'Noodle updated', updatedNoodle });
  } catch (err) {
    res.status(500).json({ message: 'Error updating noodle', error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const noodle = await Noodle.findByIdAndDelete(req.params.id);
    if (noodle?.imageUrl) {
      const imagePath = path.join(__dirname, '..', noodle.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    res.json({ message: 'Noodle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting noodle', error: err.message });
  }
});

module.exports = router;

