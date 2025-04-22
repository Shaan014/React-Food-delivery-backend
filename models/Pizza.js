// models/Noodle.js
const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const pizzaSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  bgColor: String,
  toppings: [toppingSchema],
});

module.exports = mongoose.model('Pizza', pizzaSchema);