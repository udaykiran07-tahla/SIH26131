/**
 * Root Serverless API Entrypoint for Vercel
 * Proxies all /api/* requests to the Express application.
 */
const app = require('../backend/src/app');

module.exports = app;
