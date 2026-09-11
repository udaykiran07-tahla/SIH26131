/**
 * ML Prediction Service Interface & Implementation
 * 
 * WHAT IT DOES:
 * Provides an abstract interface for crop disease and pest classification.
 * Offers both a realistic MockPredictionService (for prototype demonstration)
 * and a RealMLPredictionService (for connecting external Python/PyTorch/FastAPI models).
 * 
 * WHY IT EXISTS:
 * Tightly decouples frontend and backend from ML training workflows.
 * The entire application remains completely functional for SIH evaluation,
 * and swapping in a trained model later requires zero changes to API routes or frontend!
 */

const env = require('../config/env');
const { evaluateConfidence } = require('../utils/thresholds');

// Base Interface
class BasePredictionService {
  /**
   * Predict crop disease/pest from image and preprocessing metadata
   * @param {string} imagePath - Path to stored image
   * @param {Object} preprocessing - Preprocessing info from ImageService
   * @returns {Promise<Object>} Standardized prediction result
   */
  async predict(imagePath, preprocessing = {}) {
    throw new Error('Method predict() must be implemented.');
  }
}

/**
 * Mock Prediction Service for SIH Prototype Demonstration
 * Simulates realistic model predictions with inference latency and probability distribution.
 */
class MockPredictionService extends BasePredictionService {
  constructor() {
    super();
    // Demonstration catalog of known conditions for prototype
    this.demoCatalog = [
      {
        crop: 'Tomato',
        condition: 'Tomato Early Blight',
        type: 'disease',
        defaultConfidence: 0.91,
        alternatives: [
          { crop: 'Tomato', condition: 'Tomato Late Blight', confidence: 0.05, conditionType: 'disease' },
          { crop: 'Tomato', condition: 'Tomato Healthy', confidence: 0.03, conditionType: 'healthy' },
          { crop: 'Potato', condition: 'Potato Early Blight', confidence: 0.01, conditionType: 'disease' },
        ],
      },
      {
        crop: 'Potato',
        condition: 'Potato Late Blight',
        type: 'disease',
        defaultConfidence: 0.88,
        alternatives: [
          { crop: 'Potato', condition: 'Potato Early Blight', confidence: 0.08, conditionType: 'disease' },
          { crop: 'Tomato', condition: 'Tomato Late Blight', confidence: 0.03, conditionType: 'disease' },
          { crop: 'Potato', condition: 'Potato Healthy', confidence: 0.01, conditionType: 'healthy' },
        ],
      },
      {
        crop: 'Rice',
        condition: 'Rice Blast',
        type: 'disease',
        defaultConfidence: 0.89,
        alternatives: [
          { crop: 'Rice', condition: 'Rice Brown Spot', confidence: 0.07, conditionType: 'disease' },
          { crop: 'Rice', condition: 'Bacterial Leaf Blight', confidence: 0.03, conditionType: 'disease' },
          { crop: 'Rice', condition: 'Rice Healthy', confidence: 0.01, conditionType: 'healthy' },
        ],
      },
      {
        crop: 'Cotton',
        condition: 'Cotton Bollworm Infestation',
        type: 'pest',
        defaultConfidence: 0.92,
        alternatives: [
          { crop: 'Cotton', condition: 'Cotton Whitefly', confidence: 0.05, conditionType: 'pest' },
          { crop: 'Cotton', condition: 'Bacterial Blight', confidence: 0.02, conditionType: 'disease' },
          { crop: 'Cotton', condition: 'Cotton Healthy', confidence: 0.01, conditionType: 'healthy' },
        ],
      },
      {
        crop: 'Corn (Maize)',
        condition: 'Fall Armyworm Infestation',
        type: 'pest',
        defaultConfidence: 0.86,
        alternatives: [
          { crop: 'Corn (Maize)', condition: 'Common Rust', confidence: 0.09, conditionType: 'disease' },
          { crop: 'Corn (Maize)', condition: 'Northern Leaf Blight', confidence: 0.03, conditionType: 'disease' },
          { crop: 'Corn (Maize)', condition: 'Maize Healthy', confidence: 0.02, conditionType: 'healthy' },
        ],
      },
      {
        crop: 'Tomato',
        condition: 'Tomato Leaf Curl Virus',
        type: 'disease',
        defaultConfidence: 0.84,
        alternatives: [
          { crop: 'Tomato', condition: 'Tomato Mosaic Virus', confidence: 0.11, conditionType: 'disease' },
          { crop: 'Tomato', condition: 'Tomato Early Blight', confidence: 0.03, conditionType: 'disease' },
          { crop: 'Tomato', condition: 'Tomato Healthy', confidence: 0.02, conditionType: 'healthy' },
        ],
      },
    ];
  }

  async predict(imagePath, preprocessing = {}) {
    const startTime = Date.now();

    // Simulate realistic CNN inference latency (350 - 520ms)
    await new Promise((resolve) => setTimeout(resolve, 380 + Math.floor(Math.random() * 120)));

    const lowerPath = (imagePath || '').toLowerCase();
    const quality = preprocessing.quality || {};

    // Check if image triggers low-confidence behavior (e.g. blurry image or test tag)
    const isQualityCompromised = quality.isBlurry || quality.isTooDark || quality.isTooBright || lowerPath.includes('ambiguous') || lowerPath.includes('low_conf');

    let matchedEntry;
    if (lowerPath.includes('potato')) {
      matchedEntry = this.demoCatalog[1];
    } else if (lowerPath.includes('rice') || lowerPath.includes('paddy')) {
      matchedEntry = this.demoCatalog[2];
    } else if (lowerPath.includes('cotton') || lowerPath.includes('bollworm')) {
      matchedEntry = this.demoCatalog[3];
    } else if (lowerPath.includes('corn') || lowerPath.includes('maize') || lowerPath.includes('armyworm')) {
      matchedEntry = this.demoCatalog[4];
    } else if (lowerPath.includes('curl')) {
      matchedEntry = this.demoCatalog[5];
    } else {
      // Default to Tomato Early Blight for sample test
      matchedEntry = this.demoCatalog[0];
    }

    let confidence = matchedEntry.defaultConfidence;
    let alternatives = [...matchedEntry.alternatives];

    // If quality is compromised, simulate realistic low confidence
    if (isQualityCompromised) {
      confidence = 0.54; // Below 0.60 threshold
      alternatives = [
        { crop: matchedEntry.crop, condition: 'Uncertain foliar symptoms', confidence: 0.28, conditionType: 'disease' },
        { crop: matchedEntry.crop, condition: matchedEntry.condition, confidence: 0.26, conditionType: matchedEntry.type },
        { crop: matchedEntry.crop, condition: 'Nutritional deficiency / Sunburn', confidence: 0.20, conditionType: 'disease' },
      ];
    }

    const evalResult = evaluateConfidence(confidence);
    const inferenceTimeMs = Date.now() - startTime;

    return {
      crop: matchedEntry.crop,
      condition: matchedEntry.condition,
      conditionType: matchedEntry.type,
      confidence: Number(confidence.toFixed(2)),
      confidenceLevel: evalResult.level,
      isLowConfidence: evalResult.isLowConfidence,
      confidenceDescription: evalResult.description,
      alternatives,
      inferenceTimeMs,
      modelVersion: 'Demo-CNN-MobileNetV3-v1.0',
      isDemo: true,
      demoNotice: 'DEMO MODE: Simulated model inference for SIH evaluation. Connect real PyTorch/TensorFlow weights in ml/models/.',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Real ML Prediction Service
 * Sends preprocessed image to a live Python/FastAPI/TorchServe inference server
 */
class RealMLPredictionService extends BasePredictionService {
  async predict(imagePath, preprocessing = {}) {
    const startTime = Date.now();
    try {
      // In production, invoke Python ML server:
      const response = await fetch(env.ML_SERVICE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath, preprocessing }),
      });

      if (!response.ok) {
        throw new Error(`ML Service responded with HTTP ${response.status}`);
      }

      const data = await response.json();
      const evalResult = evaluateConfidence(data.confidence);

      return {
        crop: data.crop,
        condition: data.condition,
        conditionType: data.conditionType || 'disease',
        confidence: Number(data.confidence),
        confidenceLevel: evalResult.level,
        isLowConfidence: evalResult.isLowConfidence,
        confidenceDescription: evalResult.description,
        alternatives: data.alternatives || [],
        inferenceTimeMs: Date.now() - startTime,
        modelVersion: data.modelVersion || 'Production-v1.0',
        isDemo: false,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.warn(`[RealMLPredictionService] ML Service at ${env.ML_SERVICE_URL} unavailable. Falling back to Demo Prediction Service: ${error.message}`);
      // Fallback to mock service if ML microservice is offline during prototyping
      const mockService = new MockPredictionService();
      return await mockService.predict(imagePath, preprocessing);
    }
  }
}

// Export singleton instance based on configuration
const predictionService = env.USE_MOCK_ML
  ? new MockPredictionService()
  : new RealMLPredictionService();

module.exports = {
  BasePredictionService,
  MockPredictionService,
  RealMLPredictionService,
  predictionService,
};
