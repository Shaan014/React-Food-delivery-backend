const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
