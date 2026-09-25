const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const errorHandler = require('./middleware/errorHandler');

// Route imports
const predictionRoutes = require('./routes/predictionRoutes');
const cropRoutes = require('./routes/cropRoutes');
const conditionRoutes = require('./routes/conditionRoutes');
const datasetRoutes = require('./routes/datasetRoutes');
const modelRoutes = require('./routes/modelRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');

const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allows local Next.js frontend during development
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Ensure database connection for incoming requests (vital for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('[DB Middleware]:', err.message);
  }
  next();
});

// Static directory for uploaded images (use os.tmpdir() on Vercel)
const uploadsPath = process.env.VERCEL
  ? path.join(require('os').tmpdir(), 'uploads')
  : path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'Crop Intelligence & Pest Detection API is operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API routes
app.use('/api/predictions', predictionRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/datasets', datasetRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
