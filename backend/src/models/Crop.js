const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
      unique: true,
    },
    localNames: {
      type: Map,
      of: String,
      default: {},
    },
    scientificName: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Vegetable', 'Cereal', 'Cash Crop', 'Fruit', 'Pulse', 'Other'],
      default: 'Vegetable',
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);
