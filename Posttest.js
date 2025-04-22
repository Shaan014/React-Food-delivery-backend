const express = require('express');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const cors = require('cors');

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Define User model
const User = mongoose.model('User', new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true }
}));

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// POST API with validation and MongoDB
app.post('/api/users',
  [
    body('id').isInt().withMessage('ID must be a number'),
    body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name } = req.body;

    // Create a new user object and save to MongoDB
    try {
      const newUser = new User({ id, name });
      await newUser.save();
      res.status(201).json({ message: 'User created', data: { id, name } });
    } catch (err) {
      res.status(500).json({ message: 'Error saving user', error: err.message });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
