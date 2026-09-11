const mongoose = require('mongoose');

const referenceSchema = new mongoose.Schema({
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  dateChecked: {
    type: Date,
    default: Date.now,
  },
});

const conditionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Condition name is required'],
      trim: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ['disease', 'pest', 'healthy'],
      required: true,
      default: 'disease',
    },
    crop: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    scientificName: {
      type: String,
      trim: true,
    },
    affectedParts: [{
      type: String,
      trim: true,
    }],
    description: {
      type: String,
      required: true,
    },
    symptoms: [{
      type: String,
      required: true,
    }],
    causes: [{
      type: String,
      required: true,
    }],
    prevention: [{
      type: String,
      required: true,
    }],
    management: {
      nonChemical: [{
        type: String,
        required: true,
      }],
      chemical: {
        guidance: {
          type: String,
          default: 'Use only products registered/approved for this crop and condition in your region and follow the product label and local agricultural authority guidance.',
        },
        activeIngredients: [{
          name: String,
          registeredTarget: String,
          note: String,
        }],
        disclaimer: {
          type: String,
          default: 'IMPORTANT STATUTORY NOTICE: Use only products registered/approved for this crop and condition in your region. Strictly follow the manufacturer product label and guidance from your local Krishi Vigyan Kendra (KVK) or State Agricultural Officer. Do not exceed specified dosages or mix chemicals improperly.',
        },
      },
    },
    whenToSeekExpert: {
      type: String,
      default: 'If symptoms spread rapidly across your field or leaf yellowing exceeds 20%, immediately contact your nearest Krishi Vigyan Kendra (KVK) or District Agricultural Officer.',
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'None'],
      default: 'Moderate',
    },
    references: [referenceSchema],
    sampleImages: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

// Text index for searching conditions
conditionSchema.index({ name: 'text', crop: 'text', description: 'text' });

module.exports = mongoose.model('Condition', conditionSchema);
