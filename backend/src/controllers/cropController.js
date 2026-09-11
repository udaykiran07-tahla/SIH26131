const Crop = require('../models/Crop');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/crops
const getAllCrops = async (req, res, next) => {
  try {
    const crops = await Crop.find().sort({ name: 1 });
    return successResponse(res, crops);
  } catch (error) {
    next(error);
  }
};

// GET /api/crops/:id
const getCropById = async (req, res, next) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return errorResponse(res, 'Crop not found', 404);
    }
    return successResponse(res, crop);
  } catch (error) {
    next(error);
  }
};

// POST /api/crops (Admin)
const createCrop = async (req, res, next) => {
  try {
    const { name, localNames, scientificName, category, description, imageUrl } = req.body;
    const existing = await Crop.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existing) {
      return errorResponse(res, `Crop "${name}" already exists.`, 409);
    }

    const crop = new Crop({
      name,
      localNames: localNames || {},
      scientificName,
      category,
      description,
      imageUrl,
    });
    await crop.save();

    return successResponse(res, crop, 'Crop created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/crops/:id (Admin)
const updateCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!crop) {
      return errorResponse(res, 'Crop not found', 404);
    }
    return successResponse(res, crop, 'Crop updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/crops/:id (Admin)
const deleteCrop = async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return errorResponse(res, 'Crop not found', 404);
    }
    return successResponse(res, null, 'Crop deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
};
