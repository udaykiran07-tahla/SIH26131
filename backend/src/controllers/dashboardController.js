const Prediction = require('../models/Prediction');
const DatasetSample = require('../models/DatasetSample');
const Crop = require('../models/Crop');
const Condition = require('../models/Condition');
const ModelVersion = require('../models/ModelVersion');
const { successResponse } = require('../utils/response');

// GET /api/dashboard/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalPredictions,
      totalDiseasesDetected,
      totalPestsDetected,
      totalHealthySamples,
      lowConfidencePredictions,
      totalDatasetSamples,
      totalCrops,
      totalConditions,
      activeModel,
      cropDistribution,
      conditionDistribution,
      recentPredictions,
    ] = await Promise.all([
      Prediction.countDocuments(),
      Prediction.countDocuments({ conditionType: 'disease' }),
      Prediction.countDocuments({ conditionType: 'pest' }),
      Prediction.countDocuments({ conditionType: 'healthy' }),
      Prediction.countDocuments({ isLowConfidence: true }),
      DatasetSample.countDocuments(),
      Crop.countDocuments(),
      Condition.countDocuments(),
      ModelVersion.findOne({ status: 'Active' }),
      // Group predictions by crop
      Prediction.aggregate([
        { $group: { _id: '$crop', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      // Group predictions by condition
      Prediction.aggregate([
        { $group: { _id: '$condition', count: { $sum: 1 }, type: { $first: '$conditionType' } } },
        { $sort: { count: -1 } },
        { $limit: 6 },
      ]),
      // Recent 5 predictions
      Prediction.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('crop condition conditionType confidence isLowConfidence createdAt imagePath'),
    ]);

    return successResponse(res, {
      metrics: {
        totalPredictions,
        totalDiseasesDetected,
        totalPestsDetected,
        totalHealthySamples,
        lowConfidencePredictions,
        totalDatasetSamples,
        totalCrops,
        totalConditions,
        activeModel: activeModel ? `${activeModel.name} (${activeModel.version})` : 'Demo-CNN-v1.0 (Simulation)',
      },
      charts: {
        cropDistribution: cropDistribution.map((item) => ({ name: item._id, count: item.count })),
        conditionDistribution: conditionDistribution.map((item) => ({
          name: item._id,
          count: item.count,
          type: item.type,
        })),
      },
      recentPredictions,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
