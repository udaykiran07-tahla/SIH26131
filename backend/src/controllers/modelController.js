const ModelVersion = require('../models/ModelVersion');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/models
const getModelVersions = async (req, res, next) => {
  try {
    const models = await ModelVersion.find().sort({ createdAt: -1 });
    return successResponse(res, models);
  } catch (error) {
    next(error);
  }
};

// POST /api/models (Admin)
const createModelVersion = async (req, res, next) => {
  try {
    const { name, version, framework, datasetVersion, accuracy, precision, recall, f1Score, status, notes } = req.body;
    
    const existing = await ModelVersion.findOne({ version });
    if (existing) {
      return errorResponse(res, `Model version ${version} already registered.`, 409);
    }

    const modelVersion = new ModelVersion({
      name,
      version,
      framework: framework || 'PyTorch / MobileNetV3',
      datasetVersion: datasetVersion || 'PlantVillage-India-v1',
      accuracy,
      precision,
      recall,
      f1Score,
      status: status || 'Testing',
      notes,
    });
    await modelVersion.save();

    return successResponse(res, modelVersion, 'Model version registered successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/models/:id (Admin)
const updateModelVersion = async (req, res, next) => {
  try {
    const model = await ModelVersion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!model) {
      return errorResponse(res, 'Model version not found', 404);
    }
    return successResponse(res, model, 'Model version updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/models/:id (Admin)
const deleteModelVersion = async (req, res, next) => {
  try {
    const model = await ModelVersion.findByIdAndDelete(req.params.id);
    if (!model) {
      return errorResponse(res, 'Model version not found', 404);
    }
    return successResponse(res, null, 'Model version deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getModelVersions,
  createModelVersion,
  updateModelVersion,
  deleteModelVersion,
};
