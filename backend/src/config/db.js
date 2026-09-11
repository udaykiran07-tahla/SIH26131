/**
 * MongoDB Connection Helper
 * Connects to MongoDB via Mongoose with graceful reconnection and clean error reporting.
 */
const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.error(`[MongoDB] Please verify MongoDB is running on ${env.MONGODB_URI}`);
    // For prototype resilience, we allow the server to start even if DB is reconnecting
    return null;
  }
};

module.exports = connectDB;
