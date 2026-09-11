const DatasetSample = require('../models/DatasetSample');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/datasets
const getSamples = async (req, res, next) => {
  try {
    const { crop, category, condition, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (crop) filter.crop = { $regex: new RegExp(crop, 'i') };
    if (category) filter.category = category;
    if (condition) filter.condition = { $regex: new RegExp(condition, 'i') };
    if (search) {
      filter.$or = [
        { label: { $regex: search, $options: 'i' } },
        { crop: { $regex: search, $options: 'i' } },
        { condition: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [samples, total] = await Promise.all([
      DatasetSample.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      DatasetSample.countDocuments(filter),
    ]);

    return successResponse(res, {
      samples,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/datasets
const createSample = async (req, res, next) => {
  try {
    const { crop, condition, label, category, description, source } = req.body;

    if (!crop || !condition || !label) {
      return errorResponse(res, 'Crop, condition, and label are required fields.', 400);
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : req.body.imagePath || '/uploads/default-leaf.jpg';

    const sample = new DatasetSample({
      imagePath,
      originalFileName: req.file ? req.file.originalname : 'manual-entry.jpg',
      crop,
      condition,
      label,
      category: category || 'diseased',
      description: description || '',
      source: source || 'KVK / SIH Field Dataset',
      uploadedBy: req.admin ? req.admin.username : 'admin',
      fileSize: req.file ? req.file.size : 0,
    });

    await sample.save();
    return successResponse(res, sample, 'Dataset sample added successfully', 201);
  } catch (error) {
    next(error);
  }
};

// POST /api/datasets/bulk-csv
const bulkUploadCsv = async (req, res, next) => {
  try {
    const { rows } = req.body; // Array of { imageName, crop, condition, category, label, description, source }
    if (!Array.isArray(rows) || rows.length === 0) {
      return errorResponse(res, 'Invalid CSV payload. Expected an array of sample records.', 400);
    }

    const samplesToInsert = rows.map((r) => ({
      imagePath: r.imagePath || `/uploads/${r.imageName || 'sample.jpg'}`,
      originalFileName: r.imageName || 'dataset_entry.jpg',
      crop: r.crop || 'Unknown',
      condition: r.condition || 'General foliar issue',
      label: r.label || `${r.crop || 'Crop'} - ${r.condition || 'Condition'}`,
      category: r.category || 'diseased',
      description: r.description || '',
      source: r.source || 'Bulk CSV Import',
      uploadedBy: req.admin ? req.admin.username : 'admin',
    }));

    const inserted = await DatasetSample.insertMany(samplesToInsert);
    return successResponse(res, { count: inserted.length }, `Successfully imported ${inserted.length} dataset samples.`);
  } catch (error) {
    next(error);
  }
};

// PUT /api/datasets/:id
const updateSample = async (req, res, next) => {
  try {
    const sample = await DatasetSample.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sample) {
      return errorResponse(res, 'Sample not found', 404);
    }
    return successResponse(res, sample, 'Dataset sample updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/datasets/:id
const deleteSample = async (req, res, next) => {
  try {
    const sample = await DatasetSample.findByIdAndDelete(req.params.id);
    if (!sample) {
      return errorResponse(res, 'Sample not found', 404);
    }
    return successResponse(res, null, 'Dataset sample deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSamples,
  createSample,
  bulkUploadCsv,
  updateSample,
  deleteSample,
};
