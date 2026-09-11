const mongoose = require('mongoose');

const modelVersionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
    },
    version: {
      type: String,
      required: [true, 'Version string is required'],
      trim: true,
      unique: true,
    },
    framework: {
      type: String,
      default: 'PyTorch / MobileNetV3',
      trim: true,
    },
    datasetVersion: {
      type: String,
      default: 'PlantVillage-India-v1',
      trim: true,
    },
    trainingDate: {
      type: Date,
      default: Date.now,
    },
    // Metrics can only be entered with actual measured values from evaluations
    accuracy: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    precision: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    recall: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    f1Score: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },
    status: {
      type: String,
      enum: ['Active', 'Testing', 'Archived'],
      default: 'Active',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ModelVersion', modelVersionSchema);
