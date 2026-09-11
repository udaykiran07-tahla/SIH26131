/**
 * Standardized API Response Utilities
 * Ensures consistent JSON response structure across all endpoints.
 */
const successResponse = (res, data = {}, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

const errorResponse = (res, message = 'An unexpected error occurred', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    data: null,
    message,
  };
  if (errors) {
    payload.errors = errors;
  }
  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse,
};
