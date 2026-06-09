const mongoose = require('mongoose');

const CoffeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a coffee name.'],
      trim: true,
      index: true // Index for fast searches by name
    },
    slug: {
      type: String,
      required: [true, 'Please provide a slug for the URL.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please provide a coffee description.'],
      trim: true
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image URL.'],
      trim: true
    },
    totalVotes: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide the user who created this coffee listing.']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Coffee', CoffeeSchema);
