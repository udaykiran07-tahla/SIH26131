/**
 * Environment Configuration
 * Centralized place to read and validate environment variables with safe defaults.
 */
require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/crop_intelligence',
  JWT_SECRET: process.env.JWT_SECRET || 'sih_crop_intelligence_dev_jwt_secret_key_2026',
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  ML_SERVICE_URL: process.env.ML_SERVICE_URL || 'http://localhost:8000/predict',
  USE_MOCK_ML: process.env.USE_MOCK_ML !== 'false', // Defaults to mock ML mode until real model is connected
};

module.exports = env;
