/**
 * Prediction Controller
 * Handles image upload, preprocessing, ML prediction, recommendation matching, and history.
 */

const path = require('path');
const fs = require('fs');
const Prediction = require('../models/Prediction');
const imageService = require('../services/imageService');
const { predictionService } = require('../services/predictionService');
const recommendationService = require('../services/recommendationService');
const { successResponse, errorResponse } = require('../utils/response');

/**
 * Upload crop photo and generate diagnosis
 * POST /api/predictions
 */
const createPrediction = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        'Please select or capture a photo of the affected crop leaf or pest.',
        400
      );
    }

    const filePath = req.file.path;
    const relativeImagePath = `/uploads/${req.file.filename}`;

    // Step 1: Image Validation & Preprocessing (OpenCV/Sharp)
    let preprocessingResult;
    try {
      preprocessingResult = await imageService.processAndValidate(filePath);
    } catch (procErr) {
      // Clean up uploaded file if corrupted
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return errorResponse(res, procErr.message, 400);
    }

    // Step 2: Prediction via AI/ML service
    const predictionResult = await predictionService.predict(
      req.file.filename,
      preprocessingResult
    );

    // Step 3: Match with Agricultural Knowledge Base
    const recommendation = await recommendationService.getRecommendations(
      predictionResult.condition,
      predictionResult.crop
    );

    // Step 4: Persist to MongoDB
    const predictionRecord = new Prediction({
      imagePath: relativeImagePath,
      originalFileName: req.file.originalname,
      fileSize: req.file.size,
      dimensions: preprocessingResult.dimensions,
      crop: predictionResult.crop,
      condition: predictionResult.condition,
      conditionType: predictionResult.conditionType,
      confidence: predictionResult.confidence,
      confidenceLevel: predictionResult.confidenceLevel,
      isLowConfidence: predictionResult.isLowConfidence,
      alternatives: predictionResult.alternatives,
      preprocessingDetails: {
        resized: preprocessingResult.preprocessingSteps.resized,
        normalized: preprocessingResult.preprocessingSteps.normalized,
        blurScore: preprocessingResult.quality.sharpnessScore,
        brightnessScore: preprocessingResult.quality.brightnessScore,
        isBlurry: preprocessingResult.quality.isBlurry,
        isTooDark: preprocessingResult.quality.isTooDark,
        isTooBright: preprocessingResult.quality.isTooBright,
        format: preprocessingResult.format,
      },
      inferenceTimeMs: predictionResult.inferenceTimeMs,
      modelVersion: predictionResult.modelVersion,
      isDemo: predictionResult.isDemo,
      matchedConditionId: recommendation.conditionId || null,
    });

    await predictionRecord.save();

    return successResponse(
      res,
      {
        id: predictionRecord._id,
        imageUrl: relativeImagePath,
        prediction: {
          crop: predictionResult.crop,
          condition: predictionResult.condition,
          conditionType: predictionResult.conditionType,
          confidence: predictionResult.confidence,
          confidenceLevel: predictionResult.confidenceLevel,
          isLowConfidence: predictionResult.isLowConfidence,
          confidenceDescription: predictionResult.confidenceDescription,
          alternatives: predictionResult.alternatives,
        },
        recommendation,
        technical: {
          inferenceTimeMs: predictionResult.inferenceTimeMs,
          modelVersion: predictionResult.modelVersion,
          isDemo: predictionResult.isDemo,
          demoNotice: predictionResult.demoNotice,
          dimensions: preprocessingResult.dimensions,
          quality: preprocessingResult.quality,
          preprocessingSteps: preprocessingResult.preprocessingSteps,
        },
        createdAt: predictionRecord.createdAt,
      },
      'Crop image analyzed successfully.',
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve prediction by ID
 * GET /api/predictions/:id
 */
const getPredictionById = async (req, res, next) => {
  try {
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return errorResponse(res, 'Analysis record not found.', 404);
    }

    const recommendation = await recommendationService.getRecommendations(
      prediction.condition,
      prediction.crop
    );

    return successResponse(res, {
      prediction,
      recommendation,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Retrieve recent farmer analysis history
 * GET /api/predictions
 */
const getPredictionHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [predictions, total] = await Promise.all([
      Prediction.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('imagePath crop condition conditionType confidence confidenceLevel isLowConfidence createdAt inferenceTimeMs'),
      Prediction.countDocuments(),
    ]);

    return successResponse(res, {
      predictions,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Record farmer feedback on diagnosis accuracy
 * POST /api/predictions/:id/feedback
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { helpful, comment } = req.body;
    const prediction = await Prediction.findById(req.params.id);
    if (!prediction) {
      return errorResponse(res, 'Analysis record not found.', 404);
    }

    prediction.farmerFeedback = {
      helpful: Boolean(helpful),
      comment: comment || '',
    };
    await prediction.save();

    return successResponse(res, prediction.farmerFeedback, 'Feedback recorded. Thank you for helping improve crop intelligence.');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPrediction,
  getPredictionById,
  getPredictionHistory,
  submitFeedback,
};
