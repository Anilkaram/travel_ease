const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A destination must have a name'],
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'A destination must have a location']
  },
  description: {
    type: String,
    required: [true, 'A destination must have a description']
  },
  image: {
    type: String,
    required: [true, 'A destination must have an image']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for text search
destinationSchema.index({ name: 'text', location: 'text', description: 'text' });

// Index for case-insensitive search
destinationSchema.index({ name: 1 });
destinationSchema.index({ location: 1 });

const Destination = mongoose.model('Destination', destinationSchema);

module.exports = Destination;
