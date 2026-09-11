const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protectAdmin } = require('../middleware/auth');
const {
  getSamples,
  createSample,
  bulkUploadCsv,
  updateSample,
  deleteSample,
} = require('../controllers/datasetController');

router.get('/', getSamples);
// Admin sample upload and metadata management
router.post('/', protectAdmin, upload.single('image'), createSample);
router.post('/bulk-csv', protectAdmin, bulkUploadCsv);
router.put('/:id', protectAdmin, updateSample);
router.delete('/:id', protectAdmin, deleteSample);

module.exports = router;
