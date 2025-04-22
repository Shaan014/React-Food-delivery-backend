const mongoose = require('mongoose');



const drinksSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  bgColor: String,
 
});

module.exports = mongoose.model('Drinks', drinksSchema);