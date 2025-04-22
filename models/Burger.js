// models/Burger.js
const mongoose = require('mongoose');

const toppingSchema = new mongoose.Schema({
  name: String,
  price: Number,
});

const burgerSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  bgColor: String,
  toppings: [toppingSchema],
});

module.exports = mongoose.model('Burger', burgerSchema);

