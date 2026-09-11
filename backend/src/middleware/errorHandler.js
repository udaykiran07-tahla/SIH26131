const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.message);

  // Multer file size error
  if (err.code === 'LIMIT_FILE_SIZE') {
    return errorResponse(res, 'File too large. Please upload an image smaller than 10MB.', 400);
  }

  // Multer general error or file filter rejection
  if (err.name === 'MulterError' || err.message.includes('Invalid file type')) {
    return errorResponse(res, err.message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return errorResponse(res, `Validation failed: ${messages.join(', ')}`, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return errorResponse(res, `A record with this ${field} already exists.`, 409);
  }

  // General server error
  return errorResponse(
    res,
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred while processing your request. Please try again.'
      : err.message,
    500
  );
};

module.exports = errorHandler;
