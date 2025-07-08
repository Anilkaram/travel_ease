const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A tour must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description']
  },
  duration: {
    type: String,
    required: [true, 'A tour must have a duration']
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  location: {
    type: String,
    required: [true, 'A tour must have a location']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    required: [true, 'A tour must have an image']
  }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);