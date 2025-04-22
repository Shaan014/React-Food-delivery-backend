// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const burgerRoutes = require('./routes/burgers');
const noodleRoutes = require('./routes/noodles');
const pizzaRoutes = require('./routes/pizza');
const drinksRoutes = require('./routes/drinks');
const cartRoutes = require ('./routes/cart');


const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static image files from /uploads
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/foodDeliveryApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Mount the routes
app.use('/api/burgers', burgerRoutes); // This will handle all the burger routes
app.use('/api/noodles', noodleRoutes); // Noodels
app.use('/api/pizza', pizzaRoutes);
app.use('/api/drinks', drinksRoutes);
app.use('/api/cart',cartRoutes); // handle the cart routes

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

