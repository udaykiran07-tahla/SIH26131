const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createPrediction,
  getPredictionById,
  getPredictionHistory,
  submitFeedback,
} = require('../controllers/predictionController');

// Farmer routes: upload image, view prediction, history, feedback
router.post('/', upload.single('image'), createPrediction);
router.get('/', getPredictionHistory);
router.get('/:id', getPredictionById);
router.post('/:id/feedback', submitFeedback);

module.exports = router;
