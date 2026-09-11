const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const env = require('../config/env');
const { successResponse, errorResponse } = require('../utils/response');

// POST /api/admin/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return errorResponse(res, 'Please provide both username and password.', 400);
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return errorResponse(res, 'Invalid credentials. Please check your username and password.', 401);
    }

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials. Please check your username and password.', 401);
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: admin.role },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return successResponse(
      res,
      {
        token,
        admin: {
          id: admin._id,
          username: admin.username,
          name: admin.name,
          role: admin.role,
        },
      },
      'Admin logged in successfully'
    );
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/me
const getMe = async (req, res, next) => {
  try {
    return successResponse(res, req.admin);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  getMe,
};
