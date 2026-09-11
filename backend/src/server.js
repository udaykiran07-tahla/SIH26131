const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`========================================================`);
    console.log(`🌾 SIH Crop Intelligence Backend API Server`);
    console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
    console.log(`🔗 API Base: http://localhost:${env.PORT}/api`);
    console.log(`🌿 ML Mode: ${env.USE_MOCK_ML ? 'DEMO MOCK SERVICE' : 'PRODUCTION ML SERVICE'}`);
    console.log(`========================================================`);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.error(`[Unhandled Rejection]: ${err.message}`);
  });
};

startServer();
