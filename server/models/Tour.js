const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A tour must have a title'],
    trim: true,
    maxlength: [100, 'A tour title must have less or equal than 100 characters'],
    minlength: [10, 'A tour title must have more or equal than 10 characters']
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description'],
    trim: true
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
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

// Add indexes if needed
tourSchema.index({ price: 1, title: 1 });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;