const mongoose = require('mongoose');

const datasetSampleSchema = new mongoose.Schema(
  {
    imagePath: {
      type: String,
      required: [true, 'Sample image path is required'],
    },
    originalFileName: {
      type: String,
      default: 'sample.jpg',
    },
    crop: {
      type: String,
      required: [true, 'Crop is required'],
      trim: true,
    },
    condition: {
      type: String,
      required: [true, 'Condition name is required'],
      trim: true,
    },
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['healthy', 'diseased', 'pest'],
      required: true,
      default: 'diseased',
    },
    description: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      default: 'KVK Field Survey / PlantVillage',
      trim: true,
    },
    uploadedBy: {
      type: String,
      default: 'admin',
    },
    status: {
      type: String,
      enum: ['Verified', 'Pending Review', 'Archived'],
      default: 'Verified',
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    fileSize: Number,
  },
  {
    timestamps: true,
  }
);

// Indexes for searching and filtering
datasetSampleSchema.index({ crop: 1, condition: 1, category: 1 });

module.exports = mongoose.model('DatasetSample', datasetSampleSchema);
