const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Admin = require('../models/Admin');
const { errorResponse } = require('../utils/response');

const protectAdmin = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return errorResponse(res, 'Authentication required. Please log in as an administrator.', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select('-passwordHash');

    if (!admin) {
      return errorResponse(res, 'Admin account not found or token expired.', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired authentication session. Please log in again.', 401);
  }
};

module.exports = {
  protectAdmin,
};
