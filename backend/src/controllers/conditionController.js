const Condition = require('../models/Condition');
const { successResponse, errorResponse } = require('../utils/response');

// GET /api/conditions
const getAllConditions = async (req, res, next) => {
  try {
    const { crop, type, search } = req.query;
    const filter = {};

    if (crop) {
      filter.crop = { $regex: new RegExp(crop, 'i') };
    }
    if (type) {
      filter.type = type;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { crop: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const conditions = await Condition.find(filter).sort({ name: 1 });
    return successResponse(res, conditions);
  } catch (error) {
    next(error);
  }
};

// GET /api/conditions/:id
const getConditionById = async (req, res, next) => {
  try {
    const condition = await Condition.findById(req.params.id);
    if (!condition) {
      return errorResponse(res, 'Condition not found', 404);
    }
    return successResponse(res, condition);
  } catch (error) {
    next(error);
  }
};

// POST /api/conditions (Admin)
const createCondition = async (req, res, next) => {
  try {
    const existing = await Condition.findOne({
      name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
    });
    if (existing) {
      return errorResponse(res, `Condition "${req.body.name}" already exists.`, 409);
    }

    const condition = new Condition(req.body);
    await condition.save();

    return successResponse(res, condition, 'Condition created successfully in knowledge base', 201);
  } catch (error) {
    next(error);
  }
};

// PUT /api/conditions/:id (Admin)
const updateCondition = async (req, res, next) => {
  try {
    const condition = await Condition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!condition) {
      return errorResponse(res, 'Condition not found', 404);
    }
    return successResponse(res, condition, 'Condition updated successfully');
  } catch (error) {
    next(error);
  }
};

// DELETE /api/conditions/:id (Admin)
const deleteCondition = async (req, res, next) => {
  try {
    const condition = await Condition.findByIdAndDelete(req.params.id);
    if (!condition) {
      return errorResponse(res, 'Condition not found', 404);
    }
    return successResponse(res, null, 'Condition deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllConditions,
  getConditionById,
  createCondition,
  updateCondition,
  deleteCondition,
};
