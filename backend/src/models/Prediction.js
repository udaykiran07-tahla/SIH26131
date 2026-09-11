const mongoose = require('mongoose');

const alternativeSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  crop: { type: String, required: true },
  confidence: { type: Number, required: true },
  conditionType: { type: String, default: 'disease' },
});

const predictionSchema = new mongoose.Schema(
  {
    imagePath: {
      type: String,
      required: true,
    },
    originalFileName: {
      type: String,
      default: 'image.jpg',
    },
    fileSize: {
      type: Number,
    },
    dimensions: {
      width: Number,
      height: Number,
    },
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    condition: {
      type: String,
      required: true,
      trim: true,
    },
    conditionType: {
      type: String,
      enum: ['disease', 'pest', 'healthy'],
      default: 'disease',
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },
    confidenceLevel: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'HIGH',
    },
    isLowConfidence: {
      type: Boolean,
      default: false,
    },
    alternatives: [alternativeSchema],
    preprocessingDetails: {
      resized: { type: String, default: '224x224' },
      normalized: { type: Boolean, default: true },
      blurScore: { type: Number, default: 0 },
      brightnessScore: { type: Number, default: 0 },
      isBlurry: { type: Boolean, default: false },
      isTooDark: { type: Boolean, default: false },
      isTooBright: { type: Boolean, default: false },
      format: { type: String, default: 'JPEG' },
    },
    inferenceTimeMs: {
      type: Number,
      default: 380,
    },
    modelVersion: {
      type: String,
      default: 'Demo-CNN-v1.0',
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
    matchedConditionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Condition',
    },
    farmerFeedback: {
      helpful: { type: Boolean },
      comment: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Prediction', predictionSchema);
