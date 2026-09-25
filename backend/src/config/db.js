/**
 * MongoDB Connection Helper
 * Connects to MongoDB via Mongoose with connection pooling and caching
 * optimized for both local development and Vercel serverless environments.
 */
const mongoose = require('mongoose');
const env = require('./env');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
    };
    cached.promise = mongoose.connect(env.MONGODB_URI, opts).then((conn) => {
      console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host} (DB: ${conn.connection.name})`);
      return conn;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // For prototype resilience, return null without crashing
    return null;
  }
};

module.exports = connectDB;
